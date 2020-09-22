const express = require("express");
const { count } = require("./../models/article");
const router = express.Router();
const Article = require("./../models/article");
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


router.get("/new", (req, res) => {
    res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", { article: article });
});

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect("/");
    res.render("articles/show", { article: article });
});

// router.post('/', async (req, res) => {
//     // console.log(req.file)
//     // const fileName = req.file != null ? req.file.filename : null;
//     const article = new Article({
//         // coverImageName: fileName,
//         author: req.body.author,
//         title: req.body.title,
//         description: req.body.description,
//         markdown: req.body.markdown
//     });

//     saveCover(article, req.body.cover);

//     try {
//         const newArticle = await article.save();
//         res.redirect(`/articles/${newArticle.slug}`);
//     } catch (err) {
//         console.log(err)
//         res.render(`articles/new`, { article: article });
//     }
// })

router.post("/", async (req, res, next) => {
    req.article = new Article();
    next();
},
    saveArticleAndRedirect("new")
);

router.put("/:id", async (req, res, next) => {
        req.article = await Article.findById(req.params.id);
        next();
    },
    saveArticleAndRedirect("edit")
);

router.put("/like"), async (req, res) => {
    const articleId = await req.body.articleId;
    console.log(articleId);

    req.article = await Article.findById(articleId);

    let article = req.article;
    const Like = article.like;
    count = Like +1;
    article.like = count;

    try {
        article = await article.save();
        res.redirect("/");
    } catch (err) {
        console.log(err)
        // res.render("/", { article: article });
    }

}

router.post("/delete-all-posts", async (req, res) => {
    await Article.deleteMany({})
        .then(() => {
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
    });
});

router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

function saveArticleAndRedirect(path) {
    return async (req, res) => {

        let article = req.article;
        article.author = req.body.author;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;

        saveCover(article, req.body.cover);

        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            res.render(`articles/${path}`, { article: article });
        }
    };
}

function saveCover(article, coverEncoded) {

    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)

    if (cover != null && imageMimeTypes.includes(cover.type)) {
        article.coverImage = new Buffer.from(cover.data, 'base64')
        article.coverImageType = cover.type
    }
}

module.exports = router;
