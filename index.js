var fetchForum = require('forum-fetch');
var mongoose = require('mongoose');
var topicSchema = new mongoose.Schema({
    title: String,
    author: String,
    createTime: String,
    link: String,
    topicId: Number
});
var db = mongoose.createConnection('localhost','word'); //创建一个数据库连接
var Topic = db.model('Topic', topicSchema, 'forum');

//TODO:read JSON Config Files
var path = 'soft/gfan';
var cfgObj = require('./server/'+path+'.json');

//get DataSource
fetchForum(cfgObj.siteCfg, cfgObj.rules, cfgObj.page).then(function(ups){
    //设置ID
    if (cfgObj.siteCfg.idReg){
        var idReg = new RegExp(cfgObj.siteCfg.idReg);
        ups.forEach(function(i,n){
            var mc = idReg.exec(n.link);
            if (mc && mc.length>1){
                ups[i].topicId = mc[1];
            }
        })
    }

	Topic.collection.insert(ups, onInsert);
}).catch(function(e){
	console.log(e);
});

//write To DataBase
function onInsert(err, docs){
	if (err) {
        // TODO: handle error
    } else {
        console.info('%d topics were successfully stored.', docs.result.n);
    }
}