import express from 'express';
import path from 'path';

const router = express.Router()

const __dirname = path.resolve();

router.get('/userprofile/:filename', (req,res) => {
    const filePath = path.join(__dirname, 'uploads', 'userprofile', req.params.filename)
    res.sendFile(filePath)
})
router.get('/noticeimg/:filename', (req,res) => {
    const filePath = path.join(__dirname, 'uploads', 'noticefile', req.params.filename)
    res.sendFile(filePath)
})

router.get('/reviewimg/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', 'reviewfile', req.params.filename);
    res.sendFile(filePath);
});

export default router