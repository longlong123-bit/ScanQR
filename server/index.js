const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./databasepg")
const toml = require("toml")
const hostname = toml.server.hostname
const port = toml.server.port

//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
  }));

//get where
app.get("/employee/:id", async (req, res) => {
    try {
        const {id} = req.params
        const employee = await pool.query('select * from employee where id = $1', [id])
        res.json(employee.rows[0])
    } catch (error) { console.error(error.message) }
})
// ATTENDANCE
app.post("/attendance/check_in", async (req, res) => {
    try {
        const {check_in, check_out, worked_hours, employee_id} = req.body
        const checked_in = await pool.query(`insert into attendance(check_in, check_out, worked_hours, employee_id, employee_name) values ($1,$2,$3,$4,(select employee_name from employee where id = $4)) returning *`, [check_in, check_out, worked_hours, employee_id])
        res.json(checked_in)
        console.log(`${employee_id} checked in successfully at ${check_in}`)
    } catch (error) { console.error(error.message) }
})
app.put("/attendance/check_out/:employee_id", async (req, res) => {
    try {
        const {employee_id} = req.params
        const {check_out, worked_hours} = req.body
        const checked_out = await pool.query("update attendance set (check_out, worked_hours) = ($1,$2) where employee_id = $3 and check_out is null returning *", [check_out, worked_hours, employee_id])
        res.json(checked_out)
        console.log(`${employee_id} checked out successfully at ${check_out}. Today worked hours ${worked_hours}`);
    } catch (error) { console.error(error.message) }
})
//get where
app.get("/attendance/:employee_id", async (req, res) => {
    try {
        const {employee_id} = req.params
        const attendance = await pool.query('select * from attendance where employee_id = $1 and check_out is null', [employee_id])
        res.json(attendance.rows)
    } catch (error) { console.error(error.message) }
})
app.listen(port, hostname, () => {
    console.log(`Server has started on http://${hostname}:${port}`)
})
