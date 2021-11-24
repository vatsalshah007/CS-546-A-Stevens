const usersRoutes = require('./users')

const ConstructorMethod = (app) => {
    app.use('/', usersRoutes)

    app.use('*', (req, res) => {
        res.status(404).render("users/errors", {error404: true, title: "404: Page Not Found"})
    })
}

module.exports = ConstructorMethod;