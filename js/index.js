/**
 * Created by PC on 2016/8/30.
 */
//游戏状态
$(function () {

    //声明游戏状态
    // 游戏进行中
    const PLAYING = 0;
    // 游戏结束
    const GAME_OVER = 2;
    // 游戏分数
    var score = 0;
    // 游戏数据的数组(model)
    var cells = [
                [0,0,2,32],
                [2,4,8,16],
                [0,0,0,0],
                [8,8,8,8]
                ];
    // 页面初始化状态
        var state = PLAYING;

    $('#newGame').click(startAction);
    $('#restart').click(startAction);

    // 初始化页面
        function startAction() {
	
		// 让游戏结束页面
		$('#gameOver').css('display','none');
	
            for (var row = 0;row<4;row++){
                for(var col = 0;col<4;col++){

 // 初始化整个游戏页面
                    cells[row][col] = 0;
                }
            }
            // 积分清空
            score = 0;
            // 要随机两个数
            randomNum();
            randomNum();

            // 刷新整个页面
            updateView();

            // 两个坑
        }
     // 刷新游戏页面(让数据模型和视图建立联系)
    function updateView() {

        // 刷新积分
        $('#score').html(score);
        // 刷新游戏结束积分
        $('#finalScore').html(score);

        for (var row = 0;row<4;row++){
            for (var col = 0;col < 4;col++){
                // 拿到当前单元格的值
                var n = cells[row][col];

                // 拿到数据(div)所在的下标
              var index = ''+row+col;
                // 拿到对应的div
                var $cell = $('#cell'+index);
                // 设置基础样式
              $cell.prop('class','cell');
                if(n>0){
                   $cell.addClass('num'+n);
                    // 赋值给div
                    $cell.html(n);
                }else{
                $cell.prop('class','cell');
                    $cell.html(n);
                }
            }
        }
    }
    startAction();
    // 随机数
    function randomNum () {
        // 先写跳出的可能(布满数字,则跳出)
        if (full()) {
            return;
        };
        // 随机位置
        while(true){
            // 随机行
            var row = Math.floor(Math.random()*4);
            // 随机列
            var col = Math.floor(Math.random()*4);
            // 判断随机的位置是否可以出现随机数(2和4)
            if (cells[row][col] == 0) {
                // 说明当前位置没有数,可以出现随机数
                var n = Math.random() < 0.5 ? 2 : 4;
                cells[row][col] = n;
                break;
            };
        }
    }
    // 游戏页面布满了数字
    function full () {
        for (var row = 0;row<4;row++) {
            for (var col = 0;col <4; col++){
                if (cells[row][col]==0) {
                    return false;
                };
            }
        };
        return true;
    }

    // 绑定键盘的上下左右事件
    $(document).keydown(function (event) {
        
        switch(event.keyCode){
            case 38: upAction();
            break;
            case 40: downAction();
            break;
            case 37: leftAction();
            break;
            case 39: rightAction();
        }
    })

    // up操作
    function upAction () {
        if (gameOver()){
            return;
        }
        if (canMoveUp()) {
           // 进行数据操作(替换或累加)
           for (var col = 0;col<4;col++){
                // 分列操作
                upCol(col);
           }
           // 生成新的随机数
           randomNum();
           // 刷新页面
           updateView();
        };
    }
    // 向上移动或合并叠加数据
    function upCol (col) {
        for (var row = 0;row <4;){
            // 获取当前单元格的值
            var current = cells[row][col];
            // 查找下一个有值的单元格或者跳出
            var nextRow = getNextInCol(col,row+1,1)
            // 如果下面的单元格没有数字,跳出
            if (nextRow == -1) {
                return;
            };
            // 如果下面的单元格有值,则拿出来
            var nextNum = cells[nextRow][col];

            // 分情况替换或者叠加
            if (current == 0 ) {
                // 当前单元格为0,与下面的数字交换
                cells[row][col] = nextNum;
                cells[nextRow][col] = 0;
            }else if (current == nextNum) {
                // 如果当前数字与(穿透0后的)下一格相等
                // 合并,score增加
                cells[row][col] = current + nextNum;
                cells[nextRow][col] = 0;
                score += cells[row][col];
                row++;
            }else{
                // 当前单元格数字和下面单元格数字不相等.
                row++;
            }
        }
    }
    // 查找有值单元格所在的行
    function getNextInCol (col,row,step) {  
        while(true){
            // 判断是否越界
            if (row < 0 ||row>=4) {
            return -1;
            };
            //如果当前单元格不为0,则返回对应的行号
            if (cells[row][col] != 0) {
                return row;
            };
            row+=step;
        }
    }
    // 判断是否能向上移动
    function canMoveUp () {
        // 遍历所有的单元格,只要当前单元格
        // 上一格出现空格或者上一格数值相等,
        // 则可以移动
            for(var row = 1;row<4;row++){
                for(var col = 0;col < 4;col++){
                    if (cells[row][col] != 0) {
                        if (cells[row-1][col] == 0 ||
                            cells[row-1][col] == cells[row][col]
                            ) { 
                            return true;
                        };
                    };
                }
            }
        return false;
    }
    // down操作
    function downAction () {
        if (gameOver()){
            return;
        }
        if (canMoveDown()) {
           // 进行数据操作(替换或累加)
           for (var col = 0;col<4;col++){
                // 分列操作
                downCol(col);
           }
           // 生成新的随机数
           randomNum();
           // 刷新页面
           updateView();
        };
    }

    // 向上移动或合并叠加数据
    function downCol (col) {
        for (var row = 3;row >=0;){
            // 获取当前单元格的值
            var current = cells[row][col];
            // 查找下一个有值的单元格或者跳出
            var nextRow = getNextInCol(col,row-1,-1)
            // 如果下面的单元格没有数字,跳出
            if (nextRow == -1) {
                return;
            };
            // 如果下面的单元格有值,则拿出来
            var nextNum = cells[nextRow][col];

            // 分情况替换或者叠加
            if (current == 0 ) {
                // 当前单元格为0,与下面的数字交换
                cells[row][col] = nextNum;
                cells[nextRow][col] = 0;
            }else if (current == nextNum) {
                // 如果当前数字与(穿透0后的)下一格相等
                // 合并,score增加
                cells[row][col] = current + nextNum;
                cells[nextRow][col] = 0;
                score += cells[row][col];
                row--;
            }else{
                // 当前单元格数字和下面单元格数字不相等.
                row--;
            }
        }
    }
    // 判断是否能向上移动
    function canMoveDown () {
        // 遍历所有的单元格,只要当前单元格
        // 上一格出现空格或者上一格数值相等,
        // 则可以移动
            for(var row = 0;row<3;row++){
                for(var col = 0;col < 4;col++){
                    if (cells[row][col] != 0) {
                        if (cells[row+1][col] == 0 ||
                            cells[row+1][col] == cells[row][col]
                            ) { 
                            return true;
                        };
                    };
                }
            }
        return false;
    }

    // left操作
   //left
    function leftAction() {
        if (gameOver()){
            return;
        }
        if (canMoveLeft()){
            for(var row = 0;row<4;row++){
                moveLeft(row);
            }
            randomNum();
            updateView();
        }
    }

    function canMoveLeft() {
        for(var col = 1;col<4;col++){
            for(var row = 0;row <4 ;row++){
                if(cells[row][col]!=0){
                    if(cells[row][col -1] == 0 || cells[row][col -1] == cells[row][col]){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function moveLeft(row) {
        for(var col = 0;col<4;){
            var current = cells[row][col];
            var nextCol = getNextInRow(row,col+1,1);

            if(nextCol == -1){
                return;
            }

            var next = cells[row][nextCol];
            if (current == 0){
                cells[row][col] = next;
                cells[row][nextCol] = 0;
            }else if(current == next){
                cells[row][col] = current + next;
                cells[row][nextCol] = 0;
                score += cells[row][col];
                col++;
            }else{
                col++;
            }
        }
    }

    function getNextInRow(row,startCol,step) {
        var col = startCol;
        while (true){
            if(col<0 || col>=4){
                return -1;
            }
            if(cells[row][col] != 0){
                return col;
            }
            col += step;
        }
    }





    // right操作
    function rightAction() {
        if (gameOver()){
            return;
        }
        if (canMoveRight()){
            for(var row = 0;row<4;row++){
                moveRight(row);
            }
            randomNum();
            updateView();
        }
    }

    function canMoveRight() {
        for(var col = 0;col<3;col++){
            for(var row = 0;row <4 ;row++){
                if(cells[row][col]!=0){
                    if(cells[row][col +1] == 0 || cells[row][col +1] == cells[row][col]){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function moveRight(row) {
        for(var col = 3;col>=0;){
            var current = cells[row][col];
            var nextCol = getNextInRow(row,col-1,-1);

            if(nextCol == -1){
                return;
            }

            var next = cells[row][nextCol];
            if (current == 0){
                cells[row][col] = next;
                cells[row][nextCol] = 0;
            }else if(current == next){
                cells[row][col] = current + next;
                cells[row][nextCol] = 0;
                score += cells[row][col];
                col--;
            }else{
                col--;
            }
        }
    }


    function gameOver() {
        if (!full()){
            // 数字没有填满,游戏不结束
            return false;
        }
        // 游戏虽然填满数字,但还能叠加,游戏依然可以继续
        if( canMoveUp()
            || canMoveDown()
            || canMoveLeft()
            || canMoveRight()){
            return false;
        }
        // 游戏结束
        state = GAME_OVER;
        $('#gameOver').css('display','block');
        return true;


    }





})