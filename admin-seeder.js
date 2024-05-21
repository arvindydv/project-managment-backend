const { sequelize } = require("./models");
const models = require("./models");
const prompt = require("prompt");
const colors = require("@colors/colors/safe");
const { hash } = require("bcrypt");
// const { req } = require("./utility/serializers");

async function admin() {
  await prompt.start();

  await prompt.get(
    [
      {
        name: "firstName",
        required: true,
      },
      {
        name: "lastName",
        required: true,
      },
      {
        name: "email",
        required: true,
      },
      {
        name: "password",
        hidden: true,
        conform: function (value) {
          return true;
        },
      },

      {
        name: "designationCode",
        description: colors.magenta("Designation 101 - 3"),
        required: true,
      },
    ],
    async function (err, result) {
      // result.roleKey = result.roleKey.toUpperCase();
      const t = await sequelize.transaction();
      try {
        console.log("tyyyyyyyy>>>>>>", result);
        const data = await models.User.create(
          {
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            password: await hash(result.password, 10),
            role: "ADM",
          },
          { transaction: t }
        );

        console.log(data, "dadadadad");
        const designation = await models.Designation.findOne(
          {
            where: {
              designationCode: result.designationCode,
            },
          },
          { transaction: t }
        );

        const userId = data.dataValues.id;
        console.log(userId, "userid");
        const ds = await models.UserDesignationMapping.create(
          {
            userId: userId,
            designationId: designation.id,
          },
          { transaction: t }
        );
        console.log(ds, "usedsdsdsrid");

        console.log(colors.cyan("You are good to go."));
        await t.commit();
      } catch (error) {
        await t.rollback();
      }
    }
  );
}
admin();
