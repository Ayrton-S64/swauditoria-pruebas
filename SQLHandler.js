import { Sequelize } from "sequelize";

export default class SQLHandler{

  constructor(DBMS,HOST, PORT, DATABASE, USER, PASSWORD, URI = null){
    this.dbms = DBMS;
    this.host = HOST;
    this.port = PORT;
    this.database = DATABASE;
    this.user = USER;
    this._password = PASSWORD;
    this.conn = null;
  }

  async _connect(){
    let t_con = new Sequelize(this.database, this.user, this._password, {
      dialect: this.dbms,
      host: this.host,
      port: this.port
    })
    await t_con.authenticate();
    return t_con;
  }

  async listTables (){
    const connection = await this._connect();
    const results = await connection.query(
      `SELECT TABLE_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${this.database}'`, 
      { type: Sequelize.QueryTypes.SELECT }
    )
    const tablas = results.map((row,i) => ({
      toText: `${row.TABLE_NAME}: ${row.TABLE_ROWS}`,
      name: row.TABLE_NAME,
      rows: row.TABLE_ROWS,
      pos: i
    }));
    // console.log('Tablas: ',tablas.map(e=>e.toText));
    return tablas;
  }

  async listColumns(tabla){
    const connection = await this._connect();
    const results = await connection.query(
      `SELECT COLUMN_NAME AS COLUMNA, DATA_TYPE AS TIPO_DATO, COLUMN_TYPE AS TIPO_COLUMNA , COLUMN_DEFAULT AS DEFAULT_VALUE, IS_NULLABLE AS IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = '${this.database}' AND TABLE_NAME = '${tabla}'`, 
      { type: Sequelize.QueryTypes.SELECT }
    )
    const columnas = results.map((column,i) => ({
      toText: `${column.COLUMNA} ${column.TIPO_COLUMNA}`,
      name: column.COLUMNA,
      dataType: column.TIPO_DATO,
      columnDataType: column.TIPO_COLUMNA,
      default: column.DEFAULT_VALUE,
      nullable: column.IS_NULLABLE === 'SI',
      pos: i
    }));
    // console.log('Tablas: ',tablas.map(e=>e.toText));
    return columnas;
  }
}