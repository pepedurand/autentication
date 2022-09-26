import app from "./app";
import editUser from "./endpoints/editUser";
import createUser from "./endpoints/createUser";
import login from "./endpoints/login";
import adminEditUser from "./endpoints/adminEditUser";

app.post("/user/signup", createUser);
app.post("/user/login", login);
app.put("/user/edit/", editUser);
app.put("/admin/editUser/", adminEditUser);
