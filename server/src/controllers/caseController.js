const supabase = require('../../config/supabase');

// Get all cases for the authenticated user
const getAllCases = async (req, res) => {
  try {
    const { data: cases, error } = await supabase
      .from('cases')
      .select(`
        *,
        respondents (
          id,
          full_name,
          address
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
        *,
        respondents (
          id,
          full_name,
          address
        )
      `)
      .eq('id', id)
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
    const { case_description, respondent_name, respondent_address } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!case_description || !respondent_name || !respondent_address) {
      return res.status(400).json({ 
        error: 'case_description, respondent_name, and respondent_address are required' 
      });
    }

    // Set the user context for RLS policies (if using anon key)
    // This is an alternative to using service role key
    const userToken = req.header("Authorization")?.replace("Bearer ", "");
    if (userToken) {
      supabase.auth.setSession({ access_token: userToken, refresh_token: null });
    }

    // Start a transaction by creating the case first
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .insert({
        user_id: userId,
        case_description: case_description
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
        case_id: caseData.id,
        full_name: respondent_name,
        address: respondent_address
      })
      .select()
      .single();

    if (respondentError) {
      console.error('Error creating respondent:', respondentError);
      // Clean up the case if respondent creation fails
      await supabase.from('cases').delete().eq('id', caseData.id);
      return res.status(500).json({ error: 'Failed to create respondent' });
    }

    // Fetch the complete case with respondent data
    const { data: completeCase, error: fetchError } = await supabase
      .from('cases')
      .select(`
        *,
        respondents (
          id,
          full_name,
          address
        )
      `)
      .eq('id', caseData.id)
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
    const { case_description } = req.body;
    const userId = req.user.id;

    // Validate required field
    if (!case_description) {
      return res.status(400).json({ error: 'case_description is required' });
    }

    // First check if the case exists and belongs to the user
    const { data: existingCase, error: checkError } = await supabase
      .from('cases')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Update the case description
    const { data: updatedCase, error: updateError } = await supabase
      .from('cases')
      .update({ case_description })
      .eq('id', id)
      .eq('user_id', userId)
      .select(`
        *,
        respondents (
          id,
          full_name,
          address
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