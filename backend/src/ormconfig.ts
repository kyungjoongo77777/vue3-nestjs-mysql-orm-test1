export const connOptions ={
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: "admin",
    password: "1114",
    database: 'test002',
    synchronize: true,
    logging: true,
    cache: true,
    entities: [
        "dist/**/**.entity{.ts,.js}"
    ],
}