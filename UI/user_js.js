const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

//Get these values dynamically
//Get these values dynamically
var products;
	if(localStorage.getItem('all_products'))
	{
		//alert("Hello");
		products = JSON.parse(localStorage.getItem('all_products'));
	}
	else
	{

		products = [{"product_id":"001","product_name":"product one","product_desc":"First product","isEnded":"false"},{"product_id":"002","product_name":"product two","product_desc":"Second product","isEnded":"false"},{"product_id":"003","product_name":"product three","product_desc":"Third product","isEnded":"false"}];
	}
	console.log("User products"+products);

var user_logged_in = JSON.parse(sessionStorage.getItem('loggedUser'));
sessionStorage.removeItem('loggedUser');
console.log(user_logged_in );
document.getElementById('user_name').innerHTML = user_logged_in.userid;

if(user_logged_in.userid=='owner')
{

	displayProductsForOwner();
	document.getElementById('addbtn').style.visibility="visible";

}
else
{

	displayProductsForOthers();
}



function displayProductsForOwner()
{

	localStorage.removeItem("all_products");

	if(products.length>0)
	{
		var tab = document.getElementById("products_table");
		var header = tab.createTHead();
    		var header_row = header.insertRow(0);
    		var header_cell1 = header_row.insertCell(0);
		header_cell1.innerHTML = "Product Name";

		var header_cell2 = header_row.insertCell(1);
		header_cell2.innerHTML = "Product Description";

		for(i=0;i<products.length;i++)
        	{

			var row = tab.insertRow(i+1);
                	var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			cell1.innerHTML = products[i].product_name;
			cell2.innerHTML = products[i].product_desc;


			var cell3 = row.insertCell(2);
			if(products[i].isEnded=="true")
			{
				cell3.innerHTML = "Bid Ended!!!";
			}
			else
			{
				cell3.innerHTML = '<input type="button" onclick="endBid(this)" value="End Bid"></button>';
			}
			console.log(cell3.childNodes);
			//cell3.childNodes[0].setAttribute("id",products[i].product_id);
			cell3.id = products[i].product_id;

		}
	}
	else
	{
		alert("No products!!")
	}

}

function add_product()
{
	var productName = window.prompt("Product Name");
	var prodDesc = window.prompt("Product Description");
	var newProduct = {}
        newProduct.product_id = "00"+(products.length+1);
	newProduct.product_name = productName;
	newProduct.product_desc = prodDesc;
        newProduct.isEnded="false";

	products.push(newProduct);
	console.log(newProduct);
	console.log(products);

	var tab = document.getElementById("products_table");
	var rowIndex = products.length;
	var row = tab.insertRow(rowIndex );
        var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell1.innerHTML = newProduct.product_name;
	cell2.innerHTML = newProduct.product_desc;


	var cell3 = row.insertCell(2);
	cell3.innerHTML = '<input type="button" onclick="endBid(this)" value="End Bid"></button>';
	console.log(cell3.childNodes);

	cell3.id = newProduct.product_id;
	localStorage.setItem('all_products',JSON.stringify(products));


}

function endBid(button_ele)
{

	console.log(button_ele.parentNode.id);

	parent_id = button_ele.parentNode.id;

	bid_ended_product_id = parent_id;

	//bid_ended_product_id = button_ele.id;


	document.getElementById(parent_id).innerHTML = "Bid Ended!!!";

	for(i=0;i<products.length;i++)
	{
		if(products[i].product_id==bid_ended_product_id)
		{
			products[i].isEnded = "true";
			break;
		}
	}

	//Update the products to a common system.
	console.log(products);
	localStorage.setItem('all_products',JSON.stringify(products));

}


function displayProductsForOthers()
{


	/*//Get these values dynamically
	if(localStorage.getItem('all_products'))
	{
		//alert("Hello");
		products = JSON.parse(localStorage.getItem('all_products'));
	}
	else
	{

		products = [{"product_id":"001","product_name":"product one","product_desc":"First product","isEnded":"false"},{"product_id":"002","product_name":"product two","product_desc":"Second product","isEnded":"false"},{"product_id":"003","product_name":"product three","product_desc":"Third product","isEnded":"false"}];
	}
	console.log("User products"+products);*/
	if(products.length>0)
	{
		var tab = document.getElementById("products_table");
		var header = tab.createTHead();
    		var header_row = header.insertRow(0);
    		var header_cell1 = header_row.insertCell(0);
		header_cell1.innerHTML = "Product Name";

		var header_cell2 = header_row.insertCell(1);
		header_cell2.innerHTML = "Product Description";

		var rowIndex = 1;
		for(i=0;i<products.length;i++)
        	{
			if(products[i].isEnded=="false")
			{

				var row = tab.insertRow(rowIndex);
                		var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				cell1.innerHTML = products[i].product_name;
				cell2.innerHTML = products[i].product_desc;


				var cell3 = row.insertCell(2);
				cell3.innerHTML = '<input type="text" placeholder="$bid_amount"></input>';
				cell3.childNodes[0].setAttribute("id",products[i].product_id+"_bidamt");

				var cell4 = row.insertCell(3);
				cell4.innerHTML = '<input type="button" onclick="submitBid(this.id);" value="Submit Bid"></button>';
				cell4.childNodes[0].setAttribute("id",products[i].product_id);

				rowIndex++;
			}

		}
	}
	else
	{
		alert("No products!!")
	}

}


function submitBid(submit_btn_id)
{

	var amt_id = submit_btn_id+"_bidamt";

	var bid_amt = document.getElementById(amt_id ).value;
	console.log("User:"+user_logged_in.userid+",product_id:"+submit_btn_id+",bid_amount:"+bid_amt);
}

function logout_user()
{
	location.href="./home.html";
}
