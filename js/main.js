window.onload=function(){

   var apiPath = 'https://course-ec-api.hexschool.io/';

   new Vue({
       el:"#app",
       data:{
            edit:false,
            nowSite:0,
            show:false,
            delshow:false,
            initialProduct:{
                title:'',
                category:'',
                content:'',
                description:'',
                imageUrl:'',
                enabled:false,
                origin_price:null,
                price:null,
                unit:'',
                // option:{
                //     tax:false,
                // },
            },
            inputProduct:{
                title:'',
                category:'',
                content:'',
                description:'',
                imageUrl:'',
                enabled:false,
                origin_price:null,
                price:null,
                unit:'',
                // option:{
                //     tax:false,
                // },
            },
            tempData:{},
            realData:[],

            user: {
                token: '',
                uuid: '38903ab4-9fe0-4003-b595-7f1b87efb86e',
            },

            pagination:{},
            isNew:null,
            pageInform:{
                totalItem:0,
                nowItem:0,
                nowPage:1,
                totalPage:1,
            },
           
            // isDelete:null,

       },
       created() {

            //取得cookie中token的方式
            var test=document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            console.log(test);
            this.user.token=test;

            if (this.user.token === '') {
                  window.location = 'Login.html';
            }

            this.getProducts(1); //登入時會在首頁

       },
       methods:{

            //Below is API series

            getProducts(page) {
                const url = `${apiPath}/api/${this.user.uuid}/admin/ec/products?page=${page}`;
                //預設帶入 token
                axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
                //這行超級重要,因為是驗證透過此來做驗證
        
                axios.get(url).then((response) => { //使用箭頭函式是因為可以取代外面的this
                    console.log(response.data)
                    console.log(response.data.data);
                    console.log(this.realData);
                    
                    this.pageInform.nowPage=page;
                    this.pageInform.totalPage=response.data.meta.pagination.total_pages;
                    this.pageInform.nowItem=response.data.meta.pagination.count;
                    this.pageInform.totalItem=response.data.meta.pagination.total;
                    this.realData = response.data.data; // Get all product data
                    this.pagination = response.data.meta.pagination; // Get分頁
                });
            },
            getProduct(id) { //describe要透過這個API才能接到
                const url = `${apiPath}/api/${this.user.uuid}/admin/ec/product/${id}`;

                axios.get(url).then((response) => {
                  // Success: 得到response data
                  console.log(response);
                  this.inputProduct = response.data.data;
                  
                  // Fail
                }).catch((error) => {
                  console.log(error); // 若出現錯誤則顯示錯誤訊息
                });
            },
            updateProduct() {
                // Add new product
                let url = `${apiPath}/api/${this.user.uuid}/admin/ec/product`;
                let apiMethod = 'post';

                // If not add new product, it will be editing!!!
                if (!this.isNew) {
                    url = `${apiPath}/api/${this.user.uuid}/admin/ec/product/${this.inputProduct.id}`;
                    apiMethod = 'patch';
                }
          
                // 預設帶入 token
                axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`; //這行超級重要,因為是驗證透過此來做驗證

                console.log("yo",this.inputProduct);
                console.log(this.inputProduct.imageUrl); //陣列
                let tempImgUrl=[]; 
                tempImgUrl.push(this.inputProduct.imageUrl);
                console.log(tempImgUrl);
                this.inputProduct.imageUrl=tempImgUrl;
                console.log(this.inputProduct.imageUrl);


                axios[apiMethod](url, this.inputProduct).then(() => {
                  this.getProducts(); // 重新render畫面
                }).catch((error) => {
                  console.log(error) // 報錯訊息
                });
            },

            delProduct(ele) {
                const url = `${apiPath}/api/${this.user.uuid}/admin/ec/product/${this.realData[ele].id}`;
          
                // 預設帶入 token
                axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
                //這行超級重要,因為是驗證透過此來做驗證
          
                axios.delete(url).then(() => {
                  this.getProducts(); // Get all data and render
                });

                console.log(this.realData[ele].id);
            },

            //Below is ray's logic
            showTable(){
                this.show=true;
                if(this.show){
                    document.querySelector(".itemTable").classList.add("show");
                }
            },
            cancelTable(){
                this.show=false;
                document.querySelector(".itemTable").classList.remove("show");
            },
            insertData(){
                console.log(this.inputProduct);
                
                let newData=this.inputProduct;
                let time=(new Date()).getTime();

                this.$set(newData,'id',time);
                console.log(newData);
                this.realData.push(newData);
                console.log(this.realData);

                this.isNew=true;
                this.updateProduct(); //call the function of updateProduct 

                this.clearTable();
            },
            clearTable(){
                this.inputProduct=this.initialProduct;
                this.cancelTable();
            },
            editItem(data){
                this.showTable();

                this.edit=true;
                var i;

                this.tempData=JSON.parse(JSON.stringify(data)); //深層拷貝,其實這裡用tempData沒啥意義                                            
                console.log(this.tempData);
                
                this.realData.forEach(function(element,index){
                    // console.log(element);
                    if(element.id===data.id){
                        console.log(`find it!! ${element.id}`);
                        i=index;
                    }
                })

                this.inputProduct=JSON.parse(JSON.stringify(this.realData[i])); 
                //Ray:這邊一定要放深層複製,否則會改到原本的realData。

                
                this.getProduct(this.tempData.id);

                this.nowSite=i;
                
            },
            editComplete(){
                console.log(this.nowSite);

                this.realData[this.nowSite]=this.inputProduct;
                console.log(this.inputProduct);
                console.log(this.inputProduct.id);

                this.isNew=false;
                this.updateProduct(); //call the function of updateProduct 

                this.edit=false;
                this.clearTable();
            },
            deleteItem(id){
                var deleteSite;

                console.log(this.realData);
                this.realData.forEach(function(element,index){
                    if(id===element.id){
                        deleteSite=index;
                    }
                })

                // delshow=true;
                // if(delshow){
                //     document.querySelector(".deleteTable").classList.add("show");
                // }

                // document.querySelector(".deleteTable").classList.remove("show");
                
                let ensureDelete=confirm('真的要刪除這個行程嗎?');

                if(ensureDelete){
                    // this.realData.splice(deleteSite,1); 
                    this.delProduct(deleteSite);
                }
                
            },
            cancle(){
                this.edit=false;
                this.clearTable();
            },
            getfrontpage(val){
                console.log(val);
                this.getProducts(val);
            }
       }
   })

}