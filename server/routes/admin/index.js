

module.exports = app => {
    const express = require('express')
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require('../../models/AdminUser')
    const router = express.Router({
        mergeParams:true
    })

    router.post('/',async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success : true
        })
    })

    router.get('/', async (req, res) => {
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(500)
        res.send(items)
    })

    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    //登录校验中间件
    const authMiddleware =  require('../../middleware/auth')
    const resourceMiddlewar = require('../../middleware/resource')

    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddlewar(), router)

    const multer = require('multer')
    const upload = multer({dest: __dirname +'/../../uploads'} )
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async(req,res)=>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    app.post('/admin/api/login', async (req, res) =>{
        const {username, password} = req.body
        //1.根据用户名找用户
        const user = await AdminUser.findOne({username}).select('+password')
        assert(user, 422, '用户不存在')
        // if(!user){
        //     return res.status(422).send({
        //         message: '用户不存在或者密码错误'
        //     })
        // }

        //2.校验密码
        const isValid = require('bcryptjs').compareSync(password,user.password)
        assert(isValid, 422, '密码错误')
        
        // if(!isValid){
        //     return res.status(422).send({
        //         message: '用户不存在或者密码错误'
        //     })
        // }
        //3.返回token
        
        const token = jwt.sign({id: user._id}, app.get('secret'))
        res.send({token})
    })

    //错误处理函数
    app.use(async (err, req, res, next) =>{
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
} 