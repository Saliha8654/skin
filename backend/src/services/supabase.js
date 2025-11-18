const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Save user email and preferences
async function saveUserEmail(email, preferences = {}) {
  try {
    const { data, error } = await supabase
      .from('user_emails')
      .insert([
        {
          email: email,
          skin_type: preferences.skinType || null,
          concerns: preferences.concerns || [],
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Supabase Error:', error);
    throw new Error('Failed to save email');
  }
}

// Save chat history (optional)
async function saveChatHistory(sessionId, messages, analysis = {}) {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .insert([
        {
          session_id: sessionId,
          messages: messages,
          analysis: analysis,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Supabase Error:', error);
    // Don't throw - chat history is optional
    return { success: false, error: error.message };
  }
}

module.exports = {
  saveUserEmail,
  saveChatHistory
};
