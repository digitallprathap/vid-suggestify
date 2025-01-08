import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export async function checkAdminStatus(userId: string) {
  console.log("Checking admin status for user:", userId);
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error.message);
    throw error;
  }

  if (!profile) {
    console.error("No profile found for user");
    throw new Error('User profile not found');
  }

  if (!profile.is_admin) {
    console.error("User is not an admin");
    throw new Error('Unauthorized access. Admin privileges required.');
  }

  console.log("Admin status confirmed for user");
  return true;
}

export async function loginAdmin(email: string, password: string) {
  console.log("Attempting admin login for email:", email);
  
  const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error("Sign in error:", signInError.message);
    throw signInError;
  }

  if (!user) {
    console.error("No user returned after successful sign in");
    throw new Error('Authentication failed');
  }

  await checkAdminStatus(user.id);
  
  return user;
}

export async function sendPasswordResetEmail(email: string, redirectUrl: string) {
  console.log("Attempting to send password reset email to:", email);
  
  if (!email) {
    console.error("No email provided");
    throw new Error('Email is required');
  }

  // Send the password reset email directly
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.error("Password reset error:", error.message);
    throw error;
  }

  console.log("Password reset email sent successfully");
  return data;
}