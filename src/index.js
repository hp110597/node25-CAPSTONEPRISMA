const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("."));

app.listen(8080);

const {
  getHinhAnh,
  getHinhAnhByName,
  signUp,
  login,
  getHinhAnhById,
  getBinhLuanById,
  checkLuuHinhAnh,
  postBinhLuan,
  getUserById,
  getAnhDaLuu,
  getAnhDaTao,
  xoaHinhDaTao,
  themAnhTao,
  thayDoiThongTin,
} = require("./controllers");
const { verifyToken } = require("./middlewares/baseToken");

//------------------trang chủ------------------
app.get("/getHinhAnh", verifyToken, getHinhAnh);

app.get("/getHinhAnh/:ten_hinh", getHinhAnhByName);

//------------------trang đăng kí-------------
app.post("/signUp", signUp);
//----------trang đăng nhập-------
app.get("/login", login);

//--------trang chi tiết-------
app.get("/detail/getHinhAnh/:hinh_id", getHinhAnhById);

app.get("/detail/getBinhLuan/:hinh_id", getBinhLuanById);

app.get("/detail/checkLuuHinhAnh/:hinh_id/:nguoi_dung_id", checkLuuHinhAnh);

// app.post("/detail/postBinhLuan/:hinh_id/:nguoi_dung_id",postBinhLuan)

//--------trang quản lí ảnh----------
app.get("/personal/getNguoiDung/:nguoi_dung_id", getUserById);

app.get("/personal/getAnhDaLuu/:nguoi_dung_id", getAnhDaLuu);

app.get("/personal/getAnhDaTao/:nguoi_dung_id", getAnhDaTao);

app.delete("/personal/xoaAnhDaTao/:nguoi_dung_id/:hinh_id",xoaHinhDaTao)


//--------trang thêm ảnh---------
app.post("/personal/themAnhTao/:nguoi_dung_id/:hinh_id",themAnhTao)

//--------trang thay đổi thông tin cá nhân---------------
app.put("/thayDoiThongTin/:nguoi_dung_id",thayDoiThongTin)