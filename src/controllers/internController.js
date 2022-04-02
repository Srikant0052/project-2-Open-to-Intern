const internModel = require('../models/internModel');
const collegeModel = require('../models/collegeModel');

const { isValid, isValidRequestBody } = require('../validators/validators');


const createIntern = async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        const internDetails = req.body;
        if (!isValidRequestBody(internDetails)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
        }

        const { name, email, mobile, collegeName } = req.body;

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Nmae is required' })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Email is required' })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: 'Email should be valid email' })

        }
        const emailAlreadyUsed = await internModel.findOne({ email })
        if (emailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} is already registered` })

        }
        if (!isValid(mobile)) {
            return res.status(400).send({ status: false, message: 'Mobile number is required' })
        }
        if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile))) {
            return res.status(400).send({ status: false, message: 'Mobile number should be valid mobile number' })

        }
        const mobileAlreadyUsed = await internModel.findOne({ mobile })
        if (mobileAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${mobile} number already registered` })
        }
        if (!isValid(collegeName)) {
            return res.status(400).send({ status: false, message: 'collegeName is required' });
        }

        let college = await collegeModel.findOne({ collegeName, isDeleted: false })
        
    
        if (college.name != collegeName) {
            return res.status(400).send({ status: false, message: `This college ${collegeName} doesn't exist ` })
        }

        const internData = {
            name: name,
            email: email,
            mobile: mobile,
            collegeId: college._id
        };
        const newIntern = await internModel.create(internData);
        res.status(201).send({ status: true, message: 'Intern created successsfully', data: newIntern })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports.createIntern = createIntern;