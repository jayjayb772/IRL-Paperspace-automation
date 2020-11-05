function makeHTMLForUsers(rows){
    let htmlDoc = '<!DOCTYPE html>'
    + '<html><div style="text-align: center; font-family: Helvetica;">'
    for (const user of rows){
        console.log(user)
        htmlDoc+=buildHtml(user)
    }
    htmlDoc+='</div></html>'
    return htmlDoc
}

function buildHtml(user){
    let htmlTemp = '<div><h3>';
    htmlTemp+=`Name: ${user.name}`;
    htmlTemp+= '<h5>';
    htmlTemp+= `Depaul ID: ${user.user_id}<br>`
        + `Paperspace Eail: ${user.paperspace_email_address}<br>`
        +'</h5></h3></div><br>'
    +'--------------------------------';
    return htmlTemp;
}

module.exports = {makeHTMLForUsers}