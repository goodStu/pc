$(document).ready(function(){
	    $s=60;
	$(".check").click(function(){
		//alert($(this).attr("class")=="check");
        if($(this).attr("class")=="check"){
        $(this).attr("class","checked");
        
        settime();
        }
        else{
        	clearTimeout(i);
        $(this).attr("class","check");
        $s=60;
        $("#timenum").html($s);
        }
	})
	function settime(){
		if($s<=0){$s=60;window.location.reload();}
		$("#timenum").html($s);
		$s--;
		i=setTimeout(settime,100);
	}
})
