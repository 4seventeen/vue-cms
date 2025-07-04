const supabase = require('../../config/supabase');

// Get all cases for the authenticated user
const getAllCases = async (req, res) => {
  try {
    const { data: cases, error } = await supabase
      .from('cases')
      .select(`
        id:uuid_id,
        user_id,
        case_description,
        status,
        created_at,
        respondents (
          id:uuid_id,
          first_name,
          middle_name,
          last_name,
          suffix,
          sitio_purok_subd,
          house_no_street
        ),
        attachments:case_attachments (
          id:uuid_id,
          file_name,
          file_type,
          file_size,
          storage_path
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cases:', error);
      return res.status(500).json({ error: 'Failed to fetch cases' });
    }

    res.json({ cases });
  } catch (err) {
    console.error('Exception in getAllCases:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific case by ID (only if owned by user)
const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: caseData, error } = await supabase
      .from('cases')
      .select(`
        id:uuid_id,
        user_id,
        case_description,
        status,
        created_at,
        respondents (
          id:uuid_id,
          first_name,
          middle_name,
          last_name,
          suffix,
          sitio_purok_subd,
          house_no_street
        ),
        attachments:case_attachments (
          id:uuid_id,
          file_name,
          file_type,
          file_size,
          storage_path
        )
      `)
      .eq('uuid_id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Case not found' });
      }
      console.error('Error fetching case:', error);
      return res.status(500).json({ error: 'Failed to fetch case' });
    }

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ case: caseData });
  } catch (err) {
    console.error('Exception in getCaseById:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new case
const createCase = async (req, res) => {
  try {
    const {
      case_description,
      status: rawStatus,
      respondent_first_name,
      respondent_middle_name = null,
      respondent_last_name,
      respondent_suffix = null,
      respondent_sitio,
      respondent_house
    } = req.body;
    const userId = req.user.id;

    const statusEnum = ['pending', 'in progress', 'resolved', 'open', 'closed'];

    // Normalise and validate status
    let status = (rawStatus || 'pending').toLowerCase().replace('_', ' ');

    if (!statusEnum.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Validate required fields
    if (!case_description || !respondent_first_name || !respondent_last_name || !respondent_sitio || !respondent_house) {
      return res.status(400).json({ 
        error: 'Missing required case or respondent fields' 
      });
    }

    // NOTE: The Supabase client on the server already uses the "service role" key,
    // which bypasses RLS and does not require setting the user session manually.
    // Attempting to call supabase.auth.setSession with a missing refresh token
    // results in an "AuthApiError: refresh token required" which breaks the
    // request. Therefore we no longer call setSession here.

    // Start a transaction by creating the case first
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .insert({
        user_id: userId,
        case_description,
        status
      })
      .select()
      .single();

    if (caseError) {
      console.error('Error creating case:', caseError);
      return res.status(500).json({ error: 'Failed to create case' });
    }

    // Create the respondent record
    const { data: respondentData, error: respondentError } = await supabase
      .from('respondents')
      .insert({
        case_uuid: caseData.uuid_id,
        first_name: respondent_first_name,
        middle_name: respondent_middle_name,
        last_name: respondent_last_name,
        suffix: respondent_suffix,
        sitio_purok_subd: respondent_sitio,
        house_no_street: respondent_house
      })
      .select()
      .single();

    if (respondentError) {
      console.error('Error creating respondent:', respondentError);
      // Clean up the case if respondent creation fails
      await supabase.from('cases').delete().eq('uuid_id', caseData.uuid_id);
      return res.status(500).json({ error: 'Failed to create respondent' });
    }

    // Fetch the complete case with respondent data + attachments
    const { data: completeCase, error: fetchError } = await supabase
      .from('cases')
      .select(`
        id:uuid_id,
        user_id,
        case_description,
        status,
        created_at,
        respondents (
          id:uuid_id,
          first_name,
          middle_name,
          last_name,
          suffix,
          sitio_purok_subd,
          house_no_street
        ),
        attachments:case_attachments (
          id:uuid_id,
          file_name,
          file_type,
          file_size,
          storage_path
        )
      `)
      .eq('uuid_id', caseData.uuid_id)
      .single();

    if (fetchError) {
      console.error('Error fetching complete case:', fetchError);
      return res.status(500).json({ error: 'Case created but failed to fetch complete data' });
    }

    res.status(201).json({ 
      message: 'Case created successfully',
      case: completeCase
    });
  } catch (err) {
    console.error('Exception in createCase:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update case description (only if owned by user)
const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { case_description, status: statusRaw } = req.body;
    const userId = req.user.id;

    const statusEnum = ['pending', 'in progress', 'resolved', 'open', 'closed'];

    // Normalise and validate status
    const statusUpdate = statusRaw ? statusRaw.toLowerCase().replace('_', ' ') : null;

    if (!case_description && !statusUpdate) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    if (statusUpdate && !statusEnum.includes(statusUpdate)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // First check if the case exists and belongs to the user
    const { data: existingCase, error: checkError } = await supabase
      .from('cases')
      .select('uuid_id')
      .eq('uuid_id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Update the case description
    const updatePayload = {};
    if (case_description) updatePayload.case_description = case_description;
    if (statusUpdate) updatePayload.status = statusUpdate;

    const { data: updatedCase, error: updateError } = await supabase
      .from('cases')
      .update(updatePayload)
      .eq('uuid_id', id)
      .eq('user_id', userId)
      .select(`
        id:uuid_id,
        user_id,
        case_description,
        status,
        created_at,
        respondents (
          id:uuid_id,
          first_name,
          middle_name,
          last_name,
          suffix,
          sitio_purok_subd,
          house_no_street
        ),
        attachments:case_attachments (
          id:uuid_id,
          file_name,
          file_type,
          file_size,
          storage_path
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating case:', updateError);
      return res.status(500).json({ error: 'Failed to update case' });
    }

    res.json({ 
      message: 'Case updated successfully',
      case: updatedCase
    });
  } catch (err) {
    console.error('Exception in updateCase:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllCases,
  getCaseById,
  createCase,
  updateCase
}; 