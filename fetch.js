const request = require('request');


const fetchPatents = async(universities) => {
    const patentsMap = {};
    for(let i =0; i< universities.length; i++) {
        const uni = universities[i];
        console.log(`正在抓取：${uni}，分页大小500`)
        let [total, patents] = await getPatentsTotal(uni);
        const totalPages = Math.ceil(total/500);
        patents = await getPatentsByPage(uni, patents, 2, totalPages);
        patentsMap[uni] = patents;
        console.log(`${uni}专利抓取完成，总专利数：${patents.length}`);
    }
    
    console.log('抓取完成！！！');
    return patentsMap;
}

const getPatentsTotal = async (university, patents) => {
    const result = await fetchPatentsByPage(university, 1);
    const {rows, total} = result;
    console.log(`当前抓取${university}专利第：${1}页`);
    return [total, rows];
}

const getPatentsByPage = async(university, patents, page, totalPages) => {
    console.log(`当前抓取${university}专利第：${page}页`);
    const result = await fetchPatentsByPage(university, page);
    const {rows} = result;
    patents = patents.concat(rows);
    ++page;
    if(page <= totalPages) {
        return await getPatentsByPage(university, patents, page, totalPages);
    }
    return patents;
}

const fetchPatentsByPage = async (university, page) => {
    return new Promise((resolve, reject)=> {
        let pageSize = 500;
        page = page || 1;
        const queryParams = {
            "pageBean": {
                "page": page,
                "pageSize": pageSize
            },
            "params": {
                "statType": "UNIVERSITY_STAT",
                "applicant": university
            },
            "querys": []
        }
        request('https://bpm.ipsunlight.com/schoolLib/ipSchoolPatent/v1/query', {
            method: 'post',
            body: JSON.stringify(queryParams),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                //这里需要替换token，不然会401报错
                'Authorization': `Bearer ${token}`
            }
        }, (err, response) => {
            resolve(JSON.parse(response.body));
        })
    });

}

const getTenantByCode = async() => {
    return new Promise((resolve, reject) => {
        request('https://bpm.ipsunlight.com/uc/tenantManage/v1/getTenantByCode?code=univ', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        }, (error, response) => {
            if(!! error) {
                reject(error);
                return;
            }
            console.log(response.body);
            resolve(JSON.parse(response.body));
        })

    })
} 


const auth = (tenantId) => {
    const username = 'yk_univ';
    const password = 'MTIzNDU2';
    return new Promise((resolve, reject) => {
        request(`https://bpm.ipsunlight.com/auth?tenantId=${tenantId}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({username, password})
    }, (error, response) => {
        if(!!error) {
            reject(error);
            return;
        }
        resolve(JSON.parse(response.body));
    })
    })
    
}

const getToken = async()=> {
    const tenantData = await getTenantByCode();
    const tenantId = tenantData.id;

    const data = await auth(tenantId);
    console.log(tenantId, data);
    return data.token;
}


let token = null;

const main = async() => {

    token =await getToken();
    console.log(token);
    const universities = ["北京建筑大学", "北方工业大学"];
    //patentsMap就是你要的数据了
    const patentsMap = await fetchPatents(universities);
    universities.forEach(uni => {
        console.log(`${uni}专利数：${patentsMap[uni].length}`);
    })
}

main();
