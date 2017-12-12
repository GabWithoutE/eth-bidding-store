

var users= [{"userid":"owner","pwd":"owner1","id":'12345678'},{"userid":"user_1","pwd":"pwd1","id":'0000001'},{"userid":"user_2","pwd":"pwd2","id":'0000002'}]

var logged_id;
function validate_user()
{

	console.log(users.length);
	var isValidUser = false;
	for(i=0;i<users.length;i++)
	{
		var user_id = document.getElementById('uid').value;
		var password = document.getElementById('pwd').value;

		if( user_id== users[i].userid && password==users[i].pwd)
		{
			isValidUser = true;
			setUserToSession(users[i]);
			/*if(user_id == "owner")
			{
				
				location.href="./owner.html";
			}
			else
			{
				location.href="./user.html";
			}*/
			location.href="./user.html";
		}

	}
	if(!isValidUser)
	{
		alert("Invalid login details!!");
	}

}

function setUserToSession(user)
{

	if (typeof(Storage) !== "undefined")
	{
    		sessionStorage.setItem("loggedUser",JSON.stringify(user));

	} 
	else 
	{
    		alert("Sorry!! not supported")
	}

}

