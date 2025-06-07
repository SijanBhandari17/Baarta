//////// note : if refresh token expires , the user must logout. ( also note that , cookie.maxAge is equal to refreshToken.expiresIn , so when refreshToken expires , cookie also gets expires. now , the user should login again to get access and refresh token ). //////// 

// else use refesh token rotation method - Refresh token rotation is a security mechanism designed to minimize the risks associated with token theft and unauthorized use. In this process, each time a refresh token is used to acquire a new access token, a brand new refresh token is also generated and the previous one is invalidated. This strategy ensures that compromised refresh tokens lose their utility almost immediately, drastically reducing the potential for compromise. ///////
///////////// here we will be using refresh token rotation method , and implementing refresh token reuse detection //////////////
/// check the link - https://www.descope.com/blog/post/refresh-token-rotation ////////////
