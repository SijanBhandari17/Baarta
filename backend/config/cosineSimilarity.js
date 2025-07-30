function calculateNumber(targetString , arr)
{
    return (arr.filter(item => item === targetString ).length)
}
function returnVector(simple_arr , combined_arr)
{
    return combined_arr.map(item => calculateNumber(item , simple_arr))
}

function calculateCosineSimilarity(first_String , second_String)
{
    //////////////////////////

    const first_Arr = first_String.trim().split(' ')
    const second_Arr =second_String.trim().split(' ')

    let [i,j] = [0,0]

    const combined_Arr = []

    while(i < first_Arr.length || j < second_Arr.length)
    {
        if(!combined_Arr.includes(first_Arr[i]) && i < first_Arr.length) combined_Arr.push(first_Arr[i])
        i++
        if(!combined_Arr.includes(second_Arr[j]) && j < second_Arr.length) combined_Arr.push(second_Arr[j]) 
        j++
    }

    const first_vector = returnVector(first_Arr , combined_Arr)
    const second_vector = returnVector(second_Arr , combined_Arr)

    /////////////////////////////
    let dotProduct = 0
    let squareMagFirst = 0
    let squareMagSecond = 0
    for(let i=0; i<first_vector.length; i++)
    {
     dotProduct += first_vector[i] * second_vector[i]
     squareMagFirst += Math.pow(first_vector[i] , 2)
     squareMagSecond += Math.pow(second_vector[i] , 2)
    }
    
    magFirst = Math.sqrt(squareMagFirst)
    magSecond = Math.sqrt(squareMagSecond)
    
    const cosineVal = (dotProduct) / (magFirst * magSecond)
    
    return cosineVal
    
}

module.exports = {calculateCosineSimilarity}