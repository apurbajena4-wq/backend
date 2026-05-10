import Department from "../models/Department.js";

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public/Protected
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Admin
export const createDepartment = async (req, res) => {
    try {
        const { name, departmentCode } = req.body;

        // Check if department exists
        const existingDept = await Department.findOne({ departmentCode });
        if (existingDept) {
            return res.status(400).json({ message: "Department code already exists" });
        }

        const department = await Department.create({
            name,
            departmentCode,
        });

        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Admin
export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        await department.deleteOne();
        res.json({ message: "Department removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
