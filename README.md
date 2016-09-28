## taiko
* 使用HTML5与原生JavaScript实现太鼓达人网页版游戏
* 所用技术：HTML&css,HTML5 canvas,javascript
* [游戏演示地址](https://yuanyaoqi.github.io/taiko/) 由于音频文件过大，网页加载慢，在音乐响起前开始游戏将出现bug……

##游戏逻辑实现
根据每首歌的曲谱创建太鼓鼓点，每一个节拍有1、2、3、4、0五个值，代表四种不同鼓点或无鼓点
```
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
```
游戏一开始后便根据歌曲bpm创建太鼓鼓点，使用HTML5 canvas 使鼓点们动起来
```
setTimeout(function () {
        taikoCreat=setInterval(function () {
            creatTaiko(roadCtx,taikoComb);
        },60000/138);
        taikoMove=setInterval(function () {taikoListMove(roadCtx);},1);
    },770);
```
检测是否敲中鼓点
```
//键盘敲下,触发鼓点音效及鼓面效果,执行鼓点检测函数
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
}；
```
鼓点检测函数
```
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
```
利用localstorage获取本地排行榜
```
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
}；
```
