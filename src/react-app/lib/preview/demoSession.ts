export const demoSessionUser = {
  id: "demo-admin-user",
  email: "demo.admin@nexteraai.local",
  name: "Demo Admin",
  role: "admin",
};

export const demoSessionApiUser = {
  id: demoSessionUser.id,
  email: demoSessionUser.email,
  name: demoSessionUser.name,
  username: "demo.admin",
  role: "org_admin",
  google_user_data: {
    name: demoSessionUser.name,
  },
};
