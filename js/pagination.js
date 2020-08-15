Vue.component('pagination',{
    props:['totalpage'],
    data(){
        return{
            nowPage:1,
        }
    },
    template:`
    <div class="paginationList">
		<div class="container">
			<div class="row">
                <ul class="paginationPanel">
					<li class="paginationItem"><a href="##" @click="verifyPageLeft"><</a></li>
					<li v-for="page in totalpage" class="paginationItem"  @click="sendForntPage(page)"><a href="##" class="pageCount">{{page}}</a></li>
					<li class="paginationItem"><a href="##" @click="verifyPageRight">></a></li>
				</ul>
			</div>
		</div>
	</div>
    `,
    mounted(){
        document.getElementsByClassName('pageCount')[0].classList.add('active');
        this.nowPage=1;
    },
    methods: {
        sendForntPage(page){

            this.nowPage=page;

            console.log(page);
            this.$emit("emitnowpage",page);

            let pageCount = document.getElementsByClassName('pageCount');
            console.log(pageCount,pageCount.length);

            for(let i=0;i<pageCount.length;i++){
                pageCount[i].classList.remove('active');
            }

            pageCount[page-1].classList.add('active');
        },
        verifyPageLeft(){

            let pageCount = document.getElementsByClassName('pageCount');
            console.log(this.nowPage,pageCount.length);
            let newPage=this.nowPage-1;

            if(newPage<1){
                console.log("This is first page");
                return;
            }

            this.sendForntPage(newPage);

        },
        verifyPageRight(){

            let pageCount = document.getElementsByClassName('pageCount');
            console.log(this.nowPage,pageCount.length);
            let newPage=this.nowPage+1;

            if(newPage>pageCount.length){
                console.log("This is final page");
                return;
            }

            this.sendForntPage(newPage);

        }
    },
})

