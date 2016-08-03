/**
 * Created by yuanyaoqi on 16/7/27.
 */
var username;
var taikoList=[];//鼓点数组
//1.红鼓点小 2.蓝鼓点小 3.红鼓点大 4.蓝鼓点大
var taikoValueList=[
    1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,//前奏
    1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,//主歌
    1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,
    1,0,2,0,1,0,1,0,1,0,2,0,1,0,1,0,//过渡
    2,0,2,0,1,0,2,0,2,0,2,0,1,0,2,0,1,0,1,0,2,0,2,0,
    3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,//副歌
    4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0,
    3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,
    4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0,
    1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,//间奏
    1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,
    1,0,2,0,1,0,1,0,1,0,2,0,1,0,1,0,//过渡
    2,0,2,0,1,0,2,0,2,0,2,0,1,0,2,0,1,0,1,0,2,0,2,0,
    3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,//副歌
    4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0,
    3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,
    4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0];
var taikoValueOrder=0;//鼓点次序
var scoreNumber=0;//分数
var taikoCreat;
var taikoMove;
var dancerMove;
var dancerList=[];
window.onload=function () {
    document.getElementById("bgmusic").play();
    setTimeout(function () {
        document.getElementById("title_call").play();
    },500);
}
function gameStart() {
    username=document.getElementById("username").value;
    if(username==""){
        document.getElementById("startBox").getElementsByTagName("h4")[0].innerHTML="请输入用户名";
    }
    else if(username!==""){
        document.getElementById("startBox").style.display="none";
        document.getElementById("ruleBox").style.display="block";
    }
}
function gamePlay() {
    document.getElementById("ruleBox").style.display="none";
    document.getElementById("startBox").style.display="none";
    document.getElementById("endBox").style.display="none";
    document.getElementById("taikoBox").style.display="block";
    //清除
    taikoList=[];
    dancerList=[];
    taikoValueOrder=0;
    clearInterval(taikoCreat);
    clearInterval(taikoMove);
    clearInterval(dancerMove);
    scoreNumber=0;
    document.getElementById("scoreBoard").innerHTML=scoreNumber;
    document.getElementById("pauseChoice").style.display="none";
    //背景音乐
    document.getElementById("bgmusic").pause();
    document.getElementById("endmusic").pause();
    document.getElementById("gamestart").play();
    setTimeout(function () {
        document.getElementById("bg_travel").currentTime=0;
        document.getElementById("bg_travel").play();
    },2000);
    //太鼓鼓点
    var roadCtx=document.getElementById("roadCtx").getContext("2d");
    var taikoComb=document.getElementById("taikoComb");
    setTimeout(function () {
        taikoCreat=setInterval(function () {
            creatTaiko(roadCtx,taikoComb);
        },60000/138);
        taikoMove=setInterval(function () {taikoListMove(roadCtx);},1);
    },770);
    //舞蹈小人
    var dancerCtx=document.getElementById("dancerCtx").getContext("2d");
    var dancerTaikopng=document.getElementById("dancerTaiko");
    var dancer_1=document.getElementById("dancer_1");
    var dancergirlpng=document.getElementById("dancergirl");
    var dancerTaiko1=new dancerPrototype(dancerCtx,dancerTaikopng,340,7);
    var dancerTaiko2=new dancerPrototype(dancerCtx,dancerTaikopng,460,7);
    dancerList.push(dancerTaiko1,dancerTaiko2);
    setTimeout(function () {
        var dancer_1left=new dancerPrototype(dancerCtx,dancer_1,240,20);
        var dancer_1right=new dancerPrototype(dancerCtx,dancer_1,560,20);
        var dancer_2left=new dancerPrototype(dancerCtx,dancer_1,140,20);
        var dancer_2right=new dancerPrototype(dancerCtx,dancer_1,660,20);
        dancerList.push(dancer_1left,dancer_1right,dancer_2left,dancer_2right);
    },10000);
    setTimeout(function () {
        var dancergirl=new dancerGirltype(dancerCtx,dancergirlpng);
        dancerList.push(dancergirl);
    },85000);
    dancerMove=setInterval(function () {
        dancerCtx.clearRect(0,0,900,260);
        for(var i=0;i<dancerList.length;i++){
            dancerList[i].draw();
        }
    },120000/138/9);
    //音乐播放完毕后执行结束函数
    setTimeout(function () {
        gameEnd();
        saveScore();
    },145000);
}
function gamePause() {
    clearInterval(taikoCreat);
    clearInterval(taikoMove);
    clearInterval(dancerMove);
    document.getElementById("bg_travel").pause();
    document.getElementById("pauseChoice").style.display="block";
}
function gameContinue() {
    document.getElementById("pauseChoice").style.display="none";
    var roadCtx=document.getElementById("roadCtx").getContext("2d");
    var dancerCtx=document.getElementById("dancerCtx").getContext("2d");
    var taikoComb=document.getElementById("taikoComb");
    var dancergirl=document.getElementById("dancergirl");
    taikoCreat=setInterval(function () {
        creatTaiko(roadCtx,taikoComb);
    },60000/138);
    taikoMove=setInterval(function () {taikoListMove(roadCtx);},1);
    dancerMove=setInterval(function () {
        dancerCtx.clearRect(0,0,900,260);
        for(var i=0;i<dancerList.length;i++){
            dancerList[i].draw();
        }
    },120000/138/9);
    document.getElementById("bg_travel").play();
}

//键盘敲下,触发鼓点音效及鼓面效果,检测是否击中鼓点
window.onkeydown=function () {
    //获取鼓点图片及鼓点音效
    var taikored=document.getElementsByClassName("taikoRed");
    var taikoblue=document.getElementsByClassName("taikoBlue");
    var dong=document.getElementById("dongmusic");
    var ka=document.getElementById("kamusic");
    var k = window.event || arguments[0];
    //C
    if (k.keyCode == 67) {
        imgDisplay(taikoblue[0]);
        ka.currentTime=0;
        ka.play();
        //检测蓝鼓点
        taikoCheck("Blue");
    }
    //V
    if (k.keyCode == 86) {
        imgDisplay(taikored[0]);
        dong.currentTime=0;
        dong.play();
        //检测红鼓点
        taikoCheck("Red");
    }
    //B
    if (k.keyCode == 66) {
        imgDisplay(taikored[1]);
        dong.currentTime=0;
        dong.play();
        //检测红鼓点
        taikoCheck("Red");
    }
    //N
    if (k.keyCode == 78) {
        imgDisplay(taikoblue[1]);
        ka.currentTime=0;
        ka.play();
        //检测蓝鼓点
        taikoCheck("Blue");
    }
}
window.onkeyup=function () {
    var taikored=document.getElementsByClassName("taikoRed");
    var taikoblue=document.getElementsByClassName("taikoBlue");
    var k = window.event || arguments[0];
    if (k.keyCode == 67) {
        imgDisAppear(taikoblue[0]);
    }
    if (k.keyCode == 86) {
        imgDisAppear(taikored[0]);
    }
    if (k.keyCode == 66) {
        imgDisAppear(taikored[1]);
    }
    if (k.keyCode == 78) {
        imgDisAppear(taikoblue[1]);
    }
}
function creatTaiko(ctx,imgnode) {
    var newTaiko;
    if(taikoValueList[taikoValueOrder]==0){
        taikoValueOrder++;
        return;
    }
    if(taikoValueList[taikoValueOrder]==1){
        newTaiko=new taikoPrototype(ctx,imgnode,1,18,"咚~~");
    }
    if(taikoValueList[taikoValueOrder]==2){
        newTaiko=new taikoPrototype(ctx,imgnode,2,18,"咔~~");
    }
    if(taikoValueList[taikoValueOrder]==3){
        newTaiko=new taikoPrototype(ctx,imgnode,3,8,"咚(大)~");
    }
    if(taikoValueList[taikoValueOrder]==4){
        newTaiko=new taikoPrototype(ctx,imgnode,4,8,"咔(大)~");
    }
    taikoList.push(newTaiko);
    taikoValueOrder++;
}
//太鼓鼓点对象
function taikoPrototype(ctx,imgnode,value,drawY,text) {
    switch (value){
        case 1: this.color="Red";
                this.size="Small";
                this.drawW=50;
                break;
        case 2: this.color="Blue";
                this.size="Small";
                this.drawW=50;
                break;
        case 3: this.color="Red";
                this.size="Big";
                this.drawW=70;
                break;
        case 4: this.color="Blue";
                this.size="Big";
                this.drawW=70;
                break;
    }
    this.ctx=ctx;
    this.imgNode=imgnode;
    this.cutX=(value-1)*250;
    this.cutY=0;
    this.cutW=250;
    this.drawX=645;
    this.drawY=drawY;
    this.speed=1;
    this.draw=function () {
        this.ctx.beginPath();
        this.ctx.drawImage(this.imgNode,this.cutX,this.cutY,this.cutW,this.cutW,this.drawX,this.drawY,this.drawW,this.drawW);
        this.ctx.stroke();
        this.ctx.fillStyle="black";
        this.ctx.font="16px 微软雅黑";
        this.ctx.fillText(text,this.drawX+this.drawW/2-18,113);
    }
    this.move=function () {
        this.drawX-=this.speed;
    }
}
//鼓点移动
function taikoListMove(ctx) {
    ctx.clearRect(0,0,645,120);
    for(var i=0;i<taikoList.length;i++){
        if(taikoList[i].drawX>-taikoList[i].drawW){
            taikoList[i].draw();
            taikoList[i].move();
        }
        else{
            taikoList.splice(0,1);
        }
    }
}
//判定鼓点
function taikoCheck(taikovalue){
    var taikocheckvalue=false; //默认击中状态为false
    var scoreBoard=document.getElementById("scoreBoard");
    var taikosmile=document.getElementById("taikoSmile");
    var taikoCheckDistance;
    for(var i=0;i<taikoList.length;i++){
        if(taikoList[i].size=="Small"){
            taikoCheckDistance=22; //小鼓点的判断中心
        }
        else{taikoCheckDistance=12;} //大鼓点的判断中心
        //判定是否为可
        if(taikoList[i].drawX>taikoCheckDistance-50&&taikoList[i].drawX<taikoCheckDistance+50&&taikoList[i].color==taikovalue){
            taikocheckvalue=true; //1.击中状态改变
            //2.短暂消显示太鼓笑脸
            taikosmile.style.display="block";
            setTimeout(function () {
                taikosmile.style.display="none";
            },100);
            //3.进阶判定是否为良
            if(taikoList[i].drawX>taikoCheckDistance-30&&taikoList[i].drawX<taikoCheckDistance+30){
                judgement(0);//4.显示judgement图案及文字
                scoreNumber+=100;
            }
            else{
                judgement(1);
                scoreNumber+=50;
            }
            taikoList.splice(i,1);//5.清除该鼓点
            scoreBoard.innerHTML=scoreNumber; //6.更改分数
        }
    }
    if(taikocheckvalue==false){
        var judgementCtx=document.getElementById("judgementCtx").getContext("2d");
        var judgementText=document.getElementById("judgementText");
        judgementCtx.beginPath();
        judgementCtx.drawImage(judgementText,0,50,63,25,12,100,76,30);
        judgementCtx.stroke();
        setTimeout(function () {
            judgementCtx.clearRect(0,0,650,250);
        },200);
    } //未击中时 短暂显示"不可"
}
//显示judgement图案及文字
function judgement(a) {
    //a=0时,显示"良"及黄色光环,a=1时,显示"可"及白色光环
    var i=0; //起始帧数为0
    var judgementCtx=document.getElementById("judgementCtx").getContext("2d");
    var judgementText=document.getElementById("judgementText");
    var judgementHalo=document.getElementById("judgementHalo");
    judgementDraw();
    function judgementDraw() {
        judgementCtx.clearRect(0,0,650,250);
        judgementCtx.beginPath();
        judgementCtx.drawImage(judgementHalo,i*140,a*140,140,140,-19,93,140,140);
        judgementCtx.stroke();
        judgementCtx.beginPath();
        judgementCtx.drawImage(judgementText,0,a*25,63,25,12,100,76,30);
        judgementCtx.stroke();
        i++;
        if(i<4){
            setTimeout(judgementDraw,100); //帧数小于4时,继续调用函数
        }
        if(i==4){
            judgementCtx.clearRect(0,0,650,250); //帧数等于4时,动画结束,清除画布
        }
    }
}
//舞蹈人物
function dancerPrototype(ctx,imgnode,drawX,time) {
    this.ctx=ctx;
    this.imgNode=imgnode;
    this.cutX=0;
    this.drawX=drawX;
    this.draw=function () {
        this.ctx.beginPath();
        this.ctx.drawImage(this.imgNode,this.cutX,0,120,170,this.drawX,10,120,170);
        this.ctx.stroke();
        //改变切割图片位置,为下一次draw做准备
        this.cutX+=120;
        if(this.cutX==120*time){  //time为舞蹈人物的动作数,循环完一次后重新开始
            this.cutX=0;
        }
    }
}
function dancerGirltype(ctx,imgnode) {
    this.ctx=ctx;
    this.imgNode=imgnode;
    this.cutY=0;
    this.time=0;
    this.draw=function () {
        this.ctx.beginPath();
        this.ctx.drawImage(this.imgNode,0,this.cutY,900,190,0,68,900,190);
        this.ctx.stroke();
        //time为舞蹈人物的动作数,每四拍改变一次动作
        this.time++;
        if(this.time==4){  
            this.cutY=193;
        }
        else if(this.time==8){
            this.cutY=0;
            this.time=0;
        }
    }
}
//显示图片
function imgDisplay(img) {
    img.style.display="block";
}
//隐藏图片
function imgDisAppear(img) {
    img.style.display="none";
}
//游戏结束
function gameEnd() {
    clearInterval(taikoCreat);
    clearInterval(taikoMove);
    clearInterval(dancerMove);
    document.getElementById("taikoBox").style.display="none";
    document.getElementById("endBox").style.display="block";
    document.getElementById("bg_travel").pause();
    document.getElementById("endmusic").play();
    queryScore();
}
//保存用户分数
function saveScore(){
    var db = openDatabase("demo100","","",1024*1024*10);
    db.transaction(function(tx){
        tx.executeSql("create table if not exists scoreRank(username varchar(50), score varchar(50))");
    },function(trans,err){
        console.log(err);
    });
    db.transaction(function(tx){
        tx.executeSql("insert into scoreRank values(?,?)",[username,scoreNumber]);
    },function(trans,err){
        console.log(trans);
        console.log(err)
    },function(success){
        console.log(success);
    });
}
//获取排行榜
function queryScore(){
    var db = openDatabase("demo100","","",1024*1024*10);
    db.transaction(function(tx){
        tx.executeSql("select * from scoreRank order by score desc",[],function(trans,rs){
            console.log(rs.rows.length);
            if(rs.rows.length==0){return;}
            else if(rs.rows.length==1){
                document.getElementById("scoreRank").innerHTML='<tr><td><div id="firstIcon"></div></td><td>'+
                    rs.rows[0].username+'</td><td>'+rs.rows[0].score+'</td></tr>'+
                    '<tr><td><div id="secondIcon"></div></td><td>暂无</td><td>暂无</td></tr>'+
                    '<tr><td><div id="thirdIcon"></div></td><td>暂无</td><td>暂无</td></tr>';
            }
            else if(rs.rows.length==2){
                document.getElementById("scoreRank").innerHTML='<tr><td><div id="firstIcon"></div></td><td>'+
                    rs.rows[0].username+'</td><td>'+rs.rows[0].score+'</td></tr>'+
                    '<tr><td><div id="secondIcon"></div></td><td>'+
                    rs.rows[1].username+'</td><td>'+rs.rows[1].score+'</td></tr>'+
                    '<tr><td><div id="thirdIcon"></div></td><td>暂无</td><td>暂无</td></tr>';
            }
            else if(rs.rows.length>2) {
                document.getElementById("scoreRank").innerHTML = '<tr><td><div id="firstIcon"></div></td><td>' +
                    rs.rows[0].username + '</td><td>' + rs.rows[0].score + '</td></tr>' +
                    '<tr><td><div id="secondIcon"></div></td><td>' +
                    rs.rows[1].username + '</td><td>' + rs.rows[1].score + '</td></tr>' +
                    '<tr><td><div id="thirdIcon"></div></td><td>' +
                    rs.rows[2].username + '</td><td>' + rs.rows[2].score + '</td></tr>';
            }
        });
    });
}