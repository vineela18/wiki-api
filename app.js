const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});

const articleSchema = {
  title : String,
  content : String
};

const Article = mongoose.model("Article",articleSchema);

///////////////////// request targating all articles--

app.route("/articles")

.get(function(req,res){
  Article.find(function(err,i){
    //console.log(i);
    if(!err){
      res.send(i);
    }
    else{
      res.send(err);
    }
  });
})

.post(function(req,res){
  console.log(req.body.title);  //to make post request go to postman and use urlencoded and add
                                //key as title and value as content.
  console.log(req.body.content);

  const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Succesfully added new article");
    }
    else{
      res.send(err);
    }
  });

})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Succesfully deleted all the articles");
    }
    else{
      res.send(err);
    }
  });
});

////////////////////////request targating a particular article--

app.route("/articles/:articleTitle")
  .get(function(req,res){

    Article.findOne({title : req.params.articleTitle},function(err,i){
      if(i){
        res.send(i);
      }
      else{
        res.send("No matching article is found");
      }
    });
  })

  .put(function(req,res){
    Article.update(
      {title:req.params.articleTitle},
      {title:req.body.title, content:req.body.content},
      {overwrite:true},
      function(err){
        if(!err){
          res.send("Succesfully updated article");
        }
      }
    );
  })

  .patch(function(req,res){
    Article.update(
      {title: req.params.articleTitle},
      {$set:req.body},  //req.body will get fields which user changes and parse them.
      function(err){
        if(!err){
          req.send("Succesfully updated");
        }
        else{
          req.send(err);
        }
      }
    );
  })

  .delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err){
      if(!err){
        res.send("Succesfully deleted the article");
      }
      else{
        res.send(err);
      }
    });
  });




app.listen(3000, function(){
  console.log("Server has started on port 3000");
})
