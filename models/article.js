const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);


const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});


articleSchema.pre('validate', function(next) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true })
    }
  
    if (this.markdown) {
      this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
  
    next()
});

articleSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  })


module.exports = mongoose.model('Article', articleSchema);

