new Vue({
    el: '#app',
    data: {
      user: {
        email: '',
        password: '',
      },
      isloading:false,
    },
    methods: {
      /**
       * 登入
       * 執行登入 AJAX 後會將 token 與 expired 儲存並寫入 cookie 中，寫入完畢後在跳轉到產品頁面。
       */
      signin() {
        
            this.isloading=true;

            var apiPath = 'https://course-ec-api.hexschool.io/';
            const loginApi=`${apiPath}api/auth/login`;

            axios.post(loginApi,this.user)
                .then((res)=>{

                    this.isloading=false;
                    console.log(res);

                    const token=res.data.token; //儲存token
                    const dateline=res.data.expired; //有效時間

                    document.cookie = `token=${token};expires=${new Date(dateline * 1000)}; path=/`;
                    window.location = 'index.html';

                }).catch((error)=>{

                    this.isloading=false;

                    console.log(error);
                    alert('帳號或密碼輸入錯誤! 請重新輸入');
                    this.user.email="";
                    this.user.password="";

                });
      },
    },
  })