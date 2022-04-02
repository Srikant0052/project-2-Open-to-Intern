const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');
const { isValid, isValidRequestBody } = require('../validators/validators');

const isLogoLinkValid = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

const createCollege = async (req, res) => {
    try {
        const collegeDetails = req.body;
        if (!isValidRequestBody(collegeDetails)) {
            return res.status(400).send({ status: false, mesage: 'Invalid request parameters. Please provide college details' })
        }

        const { name, fullName, logoLink } = req.body;

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Nmae is required' })
        }
        const nameAlreadyUsed = await collegeModel.findOne({ name })
        if (nameAlreadyUsed) {
            return res.status(400).send({ status: false, message: ` College ${name} is already registered` })

        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, message: 'fullNmae is required' })
        }
        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, message: 'LogoLink is required' })
        }

        if (!(isLogoLinkValid.test(logoLink))) {
            return res.status(400).send({ status: false, message: 'LogoLink should be valid Url' })

        }

        const collegeData = { name, fullName, logoLink };
        const newCollege = await collegeModel.create(collegeData);
        res.status(201).send({ status: true, message: 'College created successfully', data: newCollege });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}

const getCollegeDetails = async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        const collegeName = req.query.name;
        if (!collegeName) {
            return res.status(400).send({ status: false, message: "Please provide collegeName" })
        }
        if (!isValidRequestBody(collegeName)) {
            return res.status(400).send({ status: false, mesage: 'Invalid request parameters. Please provide college name' })
        }
        const { name } = req.query;
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Nmae is required' })
        }

        const collegeDetails = await collegeModel.findOne({ name: collegeName, isDeleted: false });
        if (!collegeDetails) {
            return res.status(404).send({ status: false, message: "College not found" })
        }

        const { fullName, logoLink } = collegeDetails
        let collegeData = {
            name,
            fullName,
            logoLink
        }

        const collegeId = collegeDetails._id;
        const internDetails = await internModel.find({ collegeId: collegeId, isDeleted: false }, '-collegeId -isDeleted -createdAt -updatedAt -__v').sort({ createdAt: -1 });
        if (internDetails) {
            collegeData.interns = internDetails
        }
        if (internDetails.length < 0) {
            return res.status(404).send({ status: false, message: "No intern found" })
        }


        res.status(200).send({ status: true, count: internDetails.length, data: collegeData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}

module.exports = { createCollege, getCollegeDetails };

