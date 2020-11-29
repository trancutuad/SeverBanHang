
var express = require('express')
let hbs = require('express-handlebars');
let multer = require('multer');
let path = require('path');
let db = require('mongoose');

db.connect('mongodb+srv://trancutu:Tu123456@cluster0-unuxd.azure.mongodb.net/Qlbh',{
    useNewUrlParser : true,
    useUnifiedTopology:true
}).then(r=>{
    console.log('Conected');
});


var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//lấy ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename :(req, file, cb) => {
        cb(null, file.originalname);
    },
});

const uploadss = multer({
    storage: storage,
    //kiểm tra file upload có phải là hình ảnh hay không
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5,//giới hạn filesize = 5Mb
    },
});

app.use(express.static(__dirname + "/uploads"));

app.engine('.hbs',hbs({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: '',

}))
app.set('view engine','.hbs');

app.get("/",function (request,response) {

    response.render('login');
});

app.post("/login",async function (request,response) {
    var user = request.body.email;
    var password = request.body.passwordli;

    let currentUser = await KhachHang.findOne({
        username: user,
        password : password
    })
    if(currentUser== null) {
        response.render('login');
    } else {
        response.render('index',{username:user});
    }
    // let admin = await KhachHang.find().lean();
    // for( var i =0 ;i<admin.length;i++){
    //     if(admin[i].username == user && admin[i].password ==password){
    //         response.render('index');
    //         console.log("thanh cong")
    //         return;
    //     } else{
    //         response.render('login');
    //         console.log("that bai")
    //     }
    //
    // }
})
app.get("/login.hbs",function (request,response) {
    response.render('login');
})

//San Pham

let spSchame = require('./model/sanPhamSchame');
let SanPham = db.model('SanPham',spSchame);

app.get("/sanpham.hbs",async (req,res) =>{

    let item = await SanPham.find({}).lean();
    res.render('sanPham',{sanpham:item});
})
app.get("/themSP",function (request,response) {
    response.render('addSanPham');
})

app.post('/addnewSanPham', uploadss.single('imageSP') , async (req, res) => {

    var maSP = req.body.maSP;
    var ten = req.body.tenSP;
    var gia = req.body.giaSP;
    var soluong = req.body.soLuongSP;
    var image= req.file.originalname;


    const sanPham= new SanPham ({
        maSP : maSP,
        tenSP: ten,
        giaBan : gia,
        soLuong : soluong,
        image: image
    });
    try{
        await sanPham.save();
        let item = await SanPham.find({}).lean();
        res.render('sanPham',{sanpham:item});
        console.log('Thanh Cong');
    }catch (e) {
        res.send(e);
    }

});
app.get('/suaSanPham',function (req,res) {
    res.render('updateSP');
})

app.get('/updateSanPham/:id',async (req,res)=>{

    var maSP = req.query.updatemaSP;
    var ten = req.query.updatetenSP;
    var gia = req.query.updategiaSP;
    var soluong = req.query.updatesoLuongSP;

    try {
        await SanPham.findByIdAndUpdate(maSP, {
            tenSP: ten,
            giaBan : gia,
            soLuong : soluong

        });

        let item = await SanPham.find({}).lean();
        res.render('sanPham',{sanpham:item});
        console.log('Thanh Cong');

    } catch (e) {
        res.send('Co loi xay ra : ' + e.message);
        ;
    }

})
app.get('/removeSanPham', async (req, res)=> {

        let maSP = req.body.thismaSP;

        try{
        const stt = await SanPham.findOneAndDelete(maSP);
        if(!stt){
            res.send('Xóa k thành công');
        }
        else{
            let item = await SanPham.find({}).lean();
            res.render('sanPham',{sanpham:item});

            console.log('Thanh Cong')
        }
    }catch (e) {

    }
    // let sp = await SanPham.findByIdAndDelete(req.params.id);
    // res.redirect('/sanPham.hbs');

});

app.get('/getAllSanPham',async (req,res)=>{
    let item = await SanPham.find({});
    res.send(item);
})

//KHach Hang

let khSchame = require('./model/khachHangSchame');
let KhachHang = db.model('khachhang',khSchame);


app.get('/getAllKhachHang',async (req,res)=>{
    let item = await KhachHang.find({});
    res.send(item);
})


app.get("/khachHang.hbs",async (req,res) =>{

    let items = await KhachHang.find({}).lean();
    res.render('khachHang',{data:items});
})
app.get("/themKH",function (request,response) {
    response.render('khachHangAdd');
})
app.get('/suaKH', function (req,res) {
    res.render('khacHangUpdate')
})

app.post('/addnewKH', uploadss.single('avatar'), async (req, res) =>{

    var maKH = req.body.maKH;
    var user = req.body.userKH;
    var password = req.body.passwordKH;
    var hotenKH = req.body.tenKH;
    var sdtKH = req.body.sdtKH;
    var image= req.file.originalname;

    const khachHang= new KhachHang ({
        maKH : maKH,
        username : user,
        password : password,
        hotenKH : hotenKH,
        sdtKH :sdtKH,
        image:image

    });
    try{
        await khachHang.save();
        let items = await KhachHang.find({}).lean();
        res.render('khachHang',{data:items});
        console.log('Thanh Cong');
    }catch (e) {
        res.send(e);
    }

});
app.get('updateKH', async function (req, res) {

    var maKH = req.query.updatemaKH;
    var user = req.query.updateuserKH;
    var password = req.query.passwordKH;
    var hotenKH = req.query.tenKH;
    var sdtKH = req.query.sdtKH;

})
app.get('/removeKH', async function (req, res) {

    var maKH = req.query.thismaKH;

    try{
        const stt = await KhachHang.findOneAndDelete(maKH);
        if(!stt){
            res.send('Xóa k thành công');
        }
        else{
            let item = await KhachHang.find({}).lean();
            res.render('khachHang',{data:item});

            console.log('Delete Thanh Cong')
        }
    }catch (e) {

    }

});

//HoaDon
app.get('/hoaDon.hbs',function (req, res) {
     res.render('hoaDon');
})
app.get('/themHD',function (req,res) {
    res.render('hoaDonAdd');
})


app.listen(7070);