var budgetController = (function (){


    
    var Expense = function(id , description , value){
        this.id = id ;
        this.description = description ;
        this.value = value ;
        this.percentage = -1 ;
    };
    Expense.prototype.calcPercentages = function(totalIncome) {
        if ( totalIncome > 0) 
        this.percentage = Math.round((this.value/totalIncome)*100) ;
        else { this.percentage = -1 ;}
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage ;
    };
    var Income = function(id , description , value){
        this.id = id ;
        this.description = description ;
        this.value = value ;
    };

    var calcTotal = function ( type) {
        var sum = 0 ;
        data.allItems[type].forEach(function(curr){
                sum += curr.value ;
        });
        data.totals[type] = sum ;
    };

    var data = {
        allItems :{
            exp :[] ,
            inc : []
        } ,
        totals: {
            exp: 0 ,
            inc : 0 
        },
        budget : 0 ,
        percentage : -1 
    }


    console.log(data.allItems.inc[0]);
   

    return {
        addItem : function(type , des , val) {
            var newItem , ID;
            //create new  id
            if ( data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            }
            else ID = 0 ;        
            // create new item
            if ( type === 'exp') {
            newItem = new Expense(ID , des , val) ;
            }
            else if ( type === 'inc') {
            newItem = new Income(ID , des , val) ;
            } 
            // push into data
            data.allItems[type].push(newItem) ;
            return newItem ;   
        } ,

        deleteItem : function (type , id) {
            var ids , index ;
            ids = data.allItems[type].map(function(current ){
            return id ;    
                });
            index = ids.indexOf(id) ;
            
            if ( index !== -1) {
                data.allItems[type].splice(index , 1);
            }

        },

        calculateBudget : function() {
            // calc total income and exp 
            calcTotal('exp') ;
            calcTotal('inc') ;
            // calc budget income - exp 
            data.budget = data.totals.inc - data.totals.exp ;
            if ( data.totals.inc > 0) {data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)  ;
            }
        } ,

        calculatePercentage : function ()  {
            data.allItems.exp.forEach (function(curr){
                curr.calcPercentages(data.totals.inc) ;
            }) ;

        } ,

        getPercentage : function () {
            var allpercentage ;
            allpercentage = data.allItems.exp.map(function(curr){
                return curr.getPercentage() ;
            });
            return allpercentage ;
        } ,

        getBudget: function () {
            return {
                budget : data.budget , 
                totalInc : data.totals.inc ,
                totalExp : data.totals.exp,
                percentage : data.percentage 
            }
        } 

        

    };
 }) () ;


 var UIController = (function (){

    var DOMstring = {
        inputType : '.add__type'  , 
        inputDes : '.add__description' ,
        inputVal : '.add__value' ,
        inputBtn : '.add__btn',
        incomeContainer : '.income__list' ,
        expenseContainer : '.expenses__list',
        budgetLabel: '.budget__value' ,
        incomeLabel : '.budget__income--value' ,
        expenseLabel : '.budget__expenses--value' ,
        percentageLabel :'.budget__expenses--percentage' ,
        container : '.container' ,
        expensePercentageLabel : '.item__percentage'
    } ;


    
    var formatNumber = function ( num ) {
        var numSplit , int , dec ;
        num = Math.abs(num) ;
        num = num.toFixed(2) ;
        return num ;
    } ;
    return {
        getInput : function ()  {
            return {
             type : document.querySelector(DOMstring.inputType).value ,
             description : document.querySelector(DOMstring.inputDes).value ,
             value :parseFloat( document.querySelector(DOMstring.inputVal).value )
            }
        } ,

        addListItem : function (obj , type){
            var html , newHTML , element;
                // creatae html string with placeholder
            if ( type === 'inc') { 
            element = DOMstring.incomeContainer ;   
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%+ </div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;   
        }  
            else if ( type === 'exp') { 
            element = DOMstring.expenseContainer ;  
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
        }

        newHTML = html.replace('%id%',obj.id) ;
        newHTML = newHTML.replace('%description%',obj.description);
        newHTML = newHTML.replace('%value%',formatNumber(obj.value));
        document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
        },

        deleteListItem : function (selectorID) {
            var el ;
            el = document.getElementById(selectorID) ;
            el.parentNode.removeChild(el) ;
        } ,

        clearFields : function (){
            var fields , fieldArr;
            fields = document.querySelectorAll(DOMstring.inputDes + ',' + DOMstring.inputVal);
            fieldArr = Array.prototype.slice.call(fields) ;
            fieldArr.forEach(function(current , index , arr){
                current.value = "" ;
                
            }) ;
            fieldArr[0].focus();
        },
        displayBudget : function (obj) {
            document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget) ;
            document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc) ;
            document.querySelector(DOMstring.expenseLabel).textContent = formatNumber(obj.totalExp);
            if ( obj.percentage > 0) {
                document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstring.percentageLabel).textContent = '---' ;

            }
        },

        displayPercentages : function (percentage) {
            var fields =  document.querySelectorAll(DOMstring.expensePercentageLabel) ;

            var nodeListForEach = function (list , callback) {

                for ( var i = 0 ; i < list.length ; i ++){
                    callback(list[i],i) ;
                }
            };


            nodeListForEach(fields , function(current , index){
                if ( percentage[index] > 0) {
                current.textContent = percentage[index] + '%' ;
            }   else {
                current.textContent = '---' ;

            }
            }) ;
        } ,


        getDOMstring : function() {
            return  DOMstring ;
        }
    } ;

   
}) () ;


var controller = (function ( budgetCtrl , UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstring() ;

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAdditem);
        document.addEventListener('keypress', function(event) {
           if ( event.keyCode === 13) {
               ctrlAdditem () ;
           } 
        });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem) ;

    };  


    var updateBuget = function () {

        budgetCtrl.calculateBudget() ;
        var budget = budgetCtrl.getBudget () ;
        UICtrl.displayBudget(budget) ;
    };

    var updatePercentage = function () {
        budgetCtrl.calculatePercentage() ;
        var percentages = budgetCtrl.getPercentage() ;
        
        UICtrl.displayPercentages(percentages);

    } ;

    
    
    

    var ctrlAdditem = function (){
     var input , newItem ;     
    // 1 . get input

        
    input = UICtrl.getInput() ;

    if ( input.description !== "" && !isNaN(input.value) && input.value > 0) {

     // 2. add item to budget ctrl
    newItem = budgetCtrl.addItem(input.type , input.description , input.value);
    
    //3. adad the item to the UI
    UICtrl.addListItem(newItem,input.type) ;
    UICtrl.clearFields(); // clear .

     //5.display the budget on ui  and calc 
     updateBuget() ;

     updatePercentage() ;
    }
};

    var ctrlDeleteItem = function (event) {
        var itemID , splitID , type , id ;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id ;
        if ( itemID) {
            splitID = itemID.split('-') ;
            type = splitID[0] ;
            id = parseInt(splitID[1]) ;
            budgetCtrl.deleteItem(type , id) ;
            UICtrl.deleteListItem(itemID) ;
            updateBuget();
            updatePercentage() ;
                    
        }
    };
    return {
        init : function(){
            setupEventListeners();
        }
    };

}) (budgetController , UIController);


controller.init(); 