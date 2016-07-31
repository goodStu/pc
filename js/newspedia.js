jquery(document).ready(function(){
   jquery("#img1").mouseover(function(){
			jquery("#img1").attr("src","../img/newspedia-vb1.png")
		});
		jquery("#img1").mouseout(function(){
			jquery("#img1").attr("src","../img/newspedia-wb.png")
		});
})