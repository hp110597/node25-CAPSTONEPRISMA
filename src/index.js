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

app.get("/getHinhAnh/:ten_hinh",verifyToken, getHinhAnhByName);

//------------------trang đăng kí-------------
app.post("/signUp", signUp);
//----------trang đăng nhập-------
app.get("/login", login);

//--------trang chi tiết-------
app.get("/detail/getHinhAnh/:hinh_id",verifyToken, getHinhAnhById);

app.get("/detail/getBinhLuan/:hinh_id",verifyToken, getBinhLuanById);

app.get("/detail/checkLuuHinhAnh/:hinh_id/:nguoi_dung_id",verifyToken, checkLuuHinhAnh);

app.post("/detail/postBinhLuan/:hinh_id/:nguoi_dung_id",verifyToken,postBinhLuan)

//--------trang quản lí ảnh----------
app.get("/personal/getNguoiDung/",verifyToken, getUserById);

app.get("/personal/getAnhDaLuu/:nguoi_dung_id",verifyToken, getAnhDaLuu);

app.get("/personal/getAnhDaTao/:nguoi_dung_id",verifyToken, getAnhDaTao);

app.delete("/personal/xoaAnhDaTao/:nguoi_dung_id/:hinh_id",verifyToken,xoaHinhDaTao)


//--------trang thêm ảnh---------
app.post("/personal/themAnhTao/:nguoi_dung_id/:hinh_id",verifyToken,themAnhTao)

//--------trang thay đổi thông tin cá nhân---------------
app.put("/thayDoiThongTin/:nguoi_dung_id",verifyToken,thayDoiThongTin)