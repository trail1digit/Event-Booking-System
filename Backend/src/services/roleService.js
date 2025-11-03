const Module = require("../models/Module");
const Permission = require("../models/permission");
const Role = require("../models/Role");

async function addModule(data) {
    try {
        let {
            module_name,
            icon,
            path,
            key,
            position,
            parent_id
        } = data;

        const newModule = new Module({
            module_name,
            icon,
            path,
            key,
            position,
            parent_id
        });

        await newModule.save();
    } catch (err) {
        throw err;
    }

}

async function getModuleData() {
    const modules = await Module.find({ parent_id: null })
        .populate("parent_id")
        .lean();

    for (const mod of modules) {
        const submodules = await Module.find({ parent_id: mod._id });
        mod.submodules = submodules;
    }

    console.log(modules);
    return modules;

}

async function addRole(data) {
    try {
        const { role_name, is_admin, permission } = data;

        const newRole = new Role({ role_name, is_admin });
        const savedRole = await newRole.save();

        if (permission && Array.isArray(permission)) {
            const permissionDocs = permission.map(p => ({
                role_id: savedRole._id,
                module_id: p.module_id,
                create: p.create,
                edit: p.edit,
                list: p.list,
                delete: p.delete,
            }));

            await Permission.insertMany(permissionDocs);
        }
    } catch (error) {
        console.error("Error adding role with permissions:", error);
        throw error;
    }

}

module.exports = {
    addModule,
    getModuleData,
    addRole
}