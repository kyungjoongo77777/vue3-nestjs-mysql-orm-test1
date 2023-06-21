export const connOptions ={
    type: 'mysql',
    host: '34.22.64.153',
    //host: 'localhost',
    port: 3306,
    username: "root",
    password: "1114",
    database: 'test002',
    synchronize: true,
    logging: true,
    cache: true,
    entities: [
        "dist/**/**.entity{.ts,.js}"
    ],
}