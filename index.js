const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const connection = require('./database/database')
connection                  // database
    .authenticate()
    .then(() => console.log('(Conexão bd) feita com sucesso!'))
    .catch(() => console.log('(Conexão bd) mal sucedida!'))

app.set('view engine','ejs')                        // ejs
app.use(express.static('public'))                   // statics
app.use(bodyParser.urlencoded({extended: false}))    // bodyParser
app.use(bodyParser.json())                          // json

// controllers
const categoriesController = require('./categories/CategoriesController')
const articlesController   = require('./articles/ArticlesController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')




app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', (req, res) => {
    Article.findAll({order: [['id', 'DESC']]}).then(articles => {
        Category.findAll().then(categories => {

            res.render('index', {
                articles: articles,
                categories: categories
            })
        })
    })
})

app.get('/:slug', (req, res) => {
    let slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug,
        }
    }).then(article => {

        if(article != undefined){
            Category.findAll().then(categories => {

                res.render('article', {
                    article: article,
                    categories: categories
                })
            })
        } else {
            res.redirect('/')
        }
        
    }).catch(erro => {
        res.redirect('/')
    })
})

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug

    Category.findOne({
        where: {slug: slug},
        include: [{model: Article}]
    }).then(category => {

        if(category != undefined){
            Category.findAll().then(categories => {

                res.render('index', {
                    categories: categories,
                    articles: category.articles
                })
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})





app.listen(444, () => console.log('Servidor iniciado com sucesso!'))