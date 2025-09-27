// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "Email đã tồn tại" });

        const lastUser = await User.findOne().sort({ userId: -1 });
        let nextId = "U001";
        if (lastUser) {
            const num = parseInt(lastUser.userId.slice(1)) + 1;
            nextId = "U" + num.toString().padStart(3, "0");
        }


        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);


        user = new User({
            userId: nextId,
            name,
            email,
            password,
            role: "member"
        });
        await user.save();

        res.status(201).json({ msg: "Đăng ký thành công", userId: nextId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


// Login
exports.login = async (req, res) => {
    // console.log('BODY received:', req.body);

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Thông tin đăng nhập không tồn tại" });

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) return res.status(400).json({ msg: "Mật khẩu không đúng" });
        if (user.password !== password) {
            return res.status(400).json({ msg: "Mật khẩu không đúng" });
        }
        // console.log(user);

        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, "hahaha", { expiresIn: "5h" });

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
