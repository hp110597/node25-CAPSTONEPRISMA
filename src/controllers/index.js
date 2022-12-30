const { successCode, failCode, errorCode } = require("../config/response");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); //tuong tu const model = initial-Model()
const bcrypt = require("bcrypt");
const { parseToken, checkToken } = require("../middlewares/baseToken");

//--------------trang chủ---------------

const getHinhAnh = async (req, res) => {
  try {
    let data = await prisma.hinh_anh.findMany({
      include: {
        nguoi_dung: true,
      },
    });
    successCode(res, data, "Lấy dữ liệu thành công");
  } catch (err) {
    errorCode(res, "Lỗi BackEnd");
  }
};

const getHinhAnhByName = async (req, res) => {
  try {
    let { ten_hinh } = req.params;
    let data = await prisma.hinh_anh.findMany({
      include: {
        nguoi_dung: true,
      },
      where: {
        ten_hinh: {
          contains: `${ten_hinh}`,
        },
      },
    });
    successCode(res, data, "Lấy dữ liệu thành công");
  } catch (err) {
    errorCode(res, "Lỗi BackEnd");
  }
};

//-------------trang đăng kí----------
const signUp = async (req, res) => {
  try {
    let { email, mat_khau, ho_ten, tuoi } = req.body;
    //mã hóa password
    let passWordHash = bcrypt.hashSync(mat_khau, 10);
    let checkEmail = await prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });
    if (checkEmail) {
      failCode(res, "", "Email đã tồn tại");
    } else {
      let data = await prisma.nguoi_dung.create({
        data: { email, ho_ten, tuoi, mat_khau: passWordHash },
      });
      successCode(res, data, "Đăng kí thành công");
    }
  } catch (err) {
    errorCode(res, "Lỗi Backend");
  }
};
//--------------trang đăng nhập--------
const login = async (req, res) => {
  try {
    let { email, mat_khau } = req.body;
    let checkLogin = await prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });
    if (checkLogin) {
      let checkPass = bcrypt.compareSync(mat_khau, checkLogin.mat_khau);
      if (checkPass) {
        successCode(res, parseToken(checkLogin), "Đăng nhập thành công");
      } else {
        failCode(res, "", "Mật khẩu không đúng");
      }
    } else {
      failCode(res, "", "Email không đúng");
    }
  } catch (err) {
    errorCode(res, "Lỗi Backend");
  }
};

//--------------trang chi tiết----------
const getHinhAnhById = async (req, res) => {
  try {
    let { hinh_id } = req.params;
    let data = await prisma.hinh_anh.findFirst({
      include: {
        nguoi_dung: true,
      },
      where: {
        hinh_id: Number(hinh_id),
      },
    });
    successCode(res, data, "Lấy hình ảnh theo id thành công");
  } catch (err) {
    errorCode(res, "Lỗi Backend");
  }
};

const getBinhLuanById = async (req, res) => {
  try {
    let { hinh_id } = req.params;
    let data = await prisma.binh_luan.findFirst({
      //    include:{
      //       hinh_anh :true
      //    },
      where: {
        hinh_id: Number(hinh_id),
      },
    });
    successCode(res, data, "Lấy bình luận theo id ảnh thành công");
  } catch (err) {
    errorCode(res, "Lỗi Backend");
  }
};

const checkLuuHinhAnh = async (req, res) => {
  try {
    let { hinh_id, nguoi_dung_id } = req.params;
    let data = await prisma.luu_anh.findFirst({
      where: {
        nguoi_dung_id: Number(nguoi_dung_id),
        hinh_id: Number(hinh_id),
      },
    });
    if (data) {
      successCode(res, data, "Hình ảnh đã được lưu");
    } else {
      failCode(res, "", "Hình ảnh chưa được lưu");
    }
  } catch (err) {
    errorCode(res, "Lỗi Backend");
  }
};

const postBinhLuan = async (req, res) => {
  try {
    let { hinh_id, nguoi_dung_id } = req.params;
    let { noi_dung } = req.body;
    let data = await prisma.binh_luan.create({
      data: {
        nguoi_dung_id: Number(nguoi_dung_id),
        hinh_id: Number(hinh_id),
        noi_dung,
      },
    });
    console.log(data);
    successCode(res, data, "Bình luận thành công");
  } catch (err) {
    errorCode(res, "Lỗi BackEnd");
  }
};

const getUserById = async (req, res) => {
  try {
    let { nguoi_dung_id } = req.params;
    let data = await prisma.nguoi_dung.findFirst({
      where: {
        nguoi_dung_id: Number(nguoi_dung_id),
      },
    });
    successCode(res, data, "Lấy thông tin người dùng thành công");
  } catch (err) {
    errorCode(res, "Lỗi Backend");
  }
};

const getAnhDaLuu = async (req, res) => {
  try {
    let { nguoi_dung_id } = req.params;
    let data = await prisma.luu_anh.findMany({
      where: {
        nguoi_dung_id: Number(nguoi_dung_id),
      },
    });
    successCode(res, data, "Lấy danh sách ảnh đã lưu thành công");
  } catch (err) {
    errorCode(res, "Lỗi Backend");
  }
};

const getAnhDaTao = async (req, res) => {
  try {
    let { nguoi_dung_id } = req.params;
    let data = await prisma.hinh_anh.findMany({
      where: {
        nguoi_dung_id: Number(nguoi_dung_id),
      },
    });
    successCode(res, data, "Lấy danh sách ảnh đã tạo thành công");
  } catch (err) {
    errorCode(res, "Lỗi Backend");
  }
};

const xoaHinhDaTao = async (req, res) => {
  try {
    let { nguoi_dung_id, hinh_id } = req.params;
    let data = await prisma.hinh_anh.deleteMany({
      where: {
        hinh_id: Number(hinh_id),
        nguoi_dung_id: Number(nguoi_dung_id),
      },
    });
    // console.log()
    if (data.count != 0) {
      successCode(res, data, "Xóa ảnh đã tạo thành công");
    } else {
      failCode(res, data, "Xóa ảnh thất bại");
    }
  } catch (err) {
    errorCode(res, "Lỗi BackEnd");
  }
};

const themAnhTao = async (req, res) => {
  try {
    let { nguoi_dung_id, hinh_id } = req.params;
    let { ten_hinh, duong_dan, mo_ta } = req.body;
    let data = await prisma.hinh_anh.create({
      data: {
        nguoi_dung_id: Number(nguoi_dung_id),
        hinh_id: Number(hinh_id),
        ten_hinh,
        duong_dan,
        mo_ta,
      },
    });
    successCode(res, data, "Thêm ảnh thành công");
  } catch (err) {
    errorCode(res, "Lỗi BackEnd");
  }
};

const thayDoiThongTin = async (req, res) => {
  // try{
  let { nguoi_dung_id } = req.params;
  let { email, mat_khau, ho_ten, tuoi, anh_dai_dien } = req.body;
  let checkUser = await prisma.nguoi_dung.findFirst({
    where: {
      nguoi_dung_id: Number(nguoi_dung_id),
    },
  });
  if (checkUser) {
    let data = await prisma.nguoi_dung.update({
      data: {
        email,
        mat_khau,
        ho_ten,
        tuoi,
        anh_dai_dien,
      },
      where: {
        nguoi_dung_id: Number(nguoi_dung_id),
      },
    });
    successCode(res, data, "Cập nhật thành công");
  } else {
    failCode(res, nguoi_dung_id, "Người dùng không tồn tại");
  }
  // }catch(err){
  //   errorCode(res,"Lỗi Backend")
  // }
};

module.exports = {
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
};
