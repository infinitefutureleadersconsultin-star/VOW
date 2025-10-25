const fs = require('fs');

// Complete English master
const en = {
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "retry": "Retry",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "next": "Next",
    "submit": "Submit",
    "close": "Close",
    "confirm": "Confirm",
    "days": "days",
    "day": "day",
    "continue": "Continue"
  },
  "nav": {
    "dashboard": "Dashboard",
    "create_vow": "Create Vow",
    "reflect": "Reflect",
    "learn": "Learn",
    "progress": "Progress",
    "settings": "Settings",
    "profile": "Profile",
    "logout": "Logout",
    "login": "Log In",
    "signup": "Sign Up",
    "start_journey": "Start Your Journey"
  },
  "home": {
    "title": "VOW - Remember Who You Said You'd Be",
    "hero_title": "Remember Who You Said You'd Be",
    "hero_subtitle": "Healing is not warfare. It is the restoration of identity through daily, conscious remembrance of your personal vow.",
    "cta_signup": "Begin Your First Two Days",
    "cta_learn": "Learn More",
    "login": "Log In",
    "nav_signup": "Start Your Journey",
    "description": "Transform through daily remembrance. Not warfare, but awareness."
  },
  "dashboard": {
    "welcome": "Welcome back",
    "continue": "Continue refining your alignment",
    "trial_active": "Trial Active",
    "days_remaining": "days remaining",
    "day_remaining": "day remaining",
    "upgrade": "Upgrade",
    "current_alignment": "Current Alignment",
    "your_vow": "Your Vow Today",
    "create_first": "Create your first vow",
    "no_vow": "No active vow",
    "light_mode": "Light",
    "dark_mode": "Dark",
    "recent_vows": "Recent Vows",
    "view_all": "View All",
    "stats_title": "Your Progress",
    "total_vows": "Total Vows",
    "reflections": "Reflections",
    "current_streak": "Current Streak"
  },
  "vow": {
    "title": "Create Your Daily Vow",
    "subtitle": "Remember who you are beyond what happened to you",
    "statement_label": "Your Vow Statement",
    "statement_placeholder": "I vow to remember...",
    "category_label": "Category",
    "category_placeholder": "Select a category",
    "duration_label": "Duration",
    "why_matters_label": "Why This Matters",
    "why_matters_placeholder": "What will change when you keep this vow?",
    "before_identity_label": "Before Identity",
    "before_identity_placeholder": "Who you were before...",
    "becoming_identity_label": "Becoming Identity",
    "becoming_identity_placeholder": "Who you're becoming...",
    "submit": "Create Vow",
    "update": "Update Vow",
    "success": "Vow created successfully!",
    "error": "Failed to create vow",
    "breaking_chains": "Breaking Chains",
    "breaking_chains_desc": "Release what binds you",
    "honoring_time": "Honoring Time",
    "honoring_time_desc": "Reclaim your moments",
    "ending_sabotage": "Ending Self-Sabotage",
    "ending_sabotage_desc": "Stop blocking your path",
    "healing_within": "Healing Within",
    "healing_within_desc": "Restore inner peace",
    "categories": {
      "addiction": "Addiction Recovery",
      "procrastination": "Procrastination",
      "self_sabotage": "Self-Sabotage",
      "emotional": "Emotional Healing",
      "habit": "Habit Building",
      "other": "Other"
    },
    "validation": {
      "statement_required": "Vow statement is required",
      "statement_min": "Vow statement must be at least 10 characters",
      "statement_max": "Vow statement must be less than 300 characters",
      "category_required": "Please select a category"
    }
  },
  "reflection": {
    "title": "Daily Reflection",
    "subtitle": "Reflect on your journey",
    "loading": "Loading reflection...",
    "pacification": "Pacification: Accept",
    "pacification_desc": "Observe without judgment",
    "confrontation": "Confrontation: Understand",
    "confrontation_desc": "Explore the origins",
    "integration": "Integration: Become Whole",
    "integration_desc": "Merge healed and original self",
    "content_label": "Your Reflection",
    "content_placeholder": "What did you notice today?",
    "submit": "Save Reflection",
    "success": "Reflection saved successfully!",
    "error": "Failed to save reflection"
  },
  "login": {
    "title": "Sign In",
    "welcome": "Welcome back",
    "email": "Email address",
    "password": "Password",
    "submit": "Sign In",
    "forgot": "Forgot password?",
    "no_account": "Don't have an account?",
    "signup_link": "Sign up",
    "success": "Logged in successfully!",
    "error": "Invalid email or password"
  },
  "signup": {
    "title": "Create Your Account",
    "subtitle": "Begin your transformation",
    "full_name": "Full Name",
    "email": "Email",
    "password": "Password",
    "confirm_password": "Confirm Password",
    "gender": "Gender",
    "language": "Preferred Language",
    "behavior": "What brings you here?",
    "submit": "Start Free Trial",
    "have_account": "Already have an account?",
    "login_link": "Log in",
    "success": "Account created successfully!",
    "error": "Failed to create account"
  },
  "pricing": {
    "title": "Choose Your Path",
    "subtitle": "Select a plan that fits your journey",
    "select_plan": "Select Plan",
    "current_plan": "Current Plan",
    "per_month": "/month",
    "per_day": "/day",
    "popular": "Popular",
    "features": "Features"
  },
  "settings": {
    "title": "Settings",
    "account": "Account",
    "preferences": "Preferences",
    "notifications": "Notifications",
    "language": "Language",
    "theme": "Theme",
    "save_changes": "Save Changes"
  },
  "profile": {
    "title": "Profile",
    "edit": "Edit Profile",
    "save": "Save Changes"
  },
  "errors": {
    "unauthorized": "Please log in to continue",
    "not_found": "Page not found",
    "server_error": "Something went wrong. Please try again."
  }
};

// Spanish translations
const es = JSON.parse(JSON.stringify(en));
Object.assign(es, {
  "common": {"loading": "Cargando...", "error": "Error", "success": "Éxito", "retry": "Reintentar", "cancel": "Cancelar", "save": "Guardar", "delete": "Eliminar", "edit": "Editar", "back": "Atrás", "next": "Siguiente", "submit": "Enviar", "close": "Cerrar", "confirm": "Confirmar", "days": "días", "day": "día", "continue": "Continuar"},
  "nav": {"dashboard": "Panel", "create_vow": "Crear Voto", "reflect": "Reflexionar", "learn": "Aprender", "progress": "Progreso", "settings": "Configuración", "profile": "Perfil", "logout": "Cerrar Sesión", "login": "Iniciar Sesión", "signup": "Registrarse", "start_journey": "Comienza Tu Viaje"},
  "home": {"title": "VOW - Recuerda Quién Dijiste Que Serías", "hero_title": "Recuerda Quién Dijiste Que Serías", "hero_subtitle": "La curación no es guerra. Es la restauración de la identidad a través del recuerdo diario y consciente de tu voto personal.", "cta_signup": "Comienza Tus Primeros Dos Días", "cta_learn": "Aprende Más", "login": "Iniciar Sesión", "nav_signup": "Comienza Tu Viaje", "description": "Transfórmate a través del recuerdo diario. No guerra, sino conciencia."},
  "dashboard": {"welcome": "Bienvenido de nuevo", "continue": "Continúa refinando tu alineación", "trial_active": "Prueba Activa", "days_remaining": "días restantes", "day_remaining": "día restante", "upgrade": "Actualizar", "current_alignment": "Alineación Actual", "your_vow": "Tu Voto Hoy", "create_first": "Crea tu primer voto", "no_vow": "Sin voto activo", "light_mode": "Claro", "dark_mode": "Oscuro", "recent_vows": "Votos Recientes", "view_all": "Ver Todos", "stats_title": "Tu Progreso", "total_vows": "Total de Votos", "reflections": "Reflexiones", "current_streak": "Racha Actual"},
  "vow": {"title": "Crea Tu Voto Diario", "subtitle": "Recuerda quién eres más allá de lo que te pasó", "statement_label": "Tu Declaración de Voto", "statement_placeholder": "Voto recordar...", "category_label": "Categoría", "category_placeholder": "Selecciona una categoría", "duration_label": "Duración", "why_matters_label": "Por Qué Importa Esto", "why_matters_placeholder": "¿Qué cambiará cuando cumplas este voto?", "before_identity_label": "Identidad Anterior", "before_identity_placeholder": "Quién eras antes...", "becoming_identity_label": "Identidad En Desarrollo", "becoming_identity_placeholder": "En quién te estás convirtiendo...", "submit": "Crear Voto", "update": "Actualizar Voto", "success": "¡Voto creado exitosamente!", "error": "Error al crear el voto", "categories": {"addiction": "Recuperación de Adicción", "procrastination": "Procrastinación", "self_sabotage": "Auto-Sabotaje", "emotional": "Sanación Emocional", "habit": "Construcción de Hábitos", "other": "Otro"}},
  "login": {"title": "Iniciar Sesión", "welcome": "Bienvenido de nuevo", "email": "Correo electrónico", "password": "Contraseña", "submit": "Iniciar Sesión", "forgot": "¿Olvidaste tu contraseña?", "no_account": "¿No tienes una cuenta?", "signup_link": "Regístrate", "success": "¡Sesión iniciada exitosamente!", "error": "Correo o contraseña inválidos"},
  "pricing": {"title": "Elige Tu Camino", "subtitle": "Selecciona un plan que se ajuste a tu viaje", "select_plan": "Seleccionar Plan", "current_plan": "Plan Actual", "per_month": "/mes", "per_day": "/día", "popular": "Popular", "features": "Características"}
});

// Save all files
fs.writeFileSync('locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('locales/es.json', JSON.stringify(es, null, 2));

console.log('✅ Created en.json and es.json');
console.log('Note: fr.json, hi.json, zh.json, pt.json will use en.json as base for now');
console.log('Run professional translation service for production');
