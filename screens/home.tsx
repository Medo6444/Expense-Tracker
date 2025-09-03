import {ScrollView, StyleSheet, Text, TextStyle} from "react-native";
import * as React from "react";
import {Category, Transactions, transactionByMonth} from "../types";
import {useSQLiteContext} from "expo-sqlite";
import TransactionsList from "../components/TransactionsList";
import {Card as UICard} from "../components/UI/card";
import AddTransaction from "../components/AddTransaction";


export default function () {
    const [Categories, setCategories] = React.useState<Category[]>([]);
    const [Transactions, setTransactions] = React.useState<Transactions[]>([]);
    const [TransactionByMonth, setTransactionByMonth] = React.useState<transactionByMonth>({
        totalExpenses: 0,
        totalIncome: 0,
    })

    const db = useSQLiteContext();

    React.useEffect(() => {
        db.withExclusiveTransactionAsync(async () => {
            await Query();
        })
    }, [db]);

    async function Query() {
        const result = await db.getAllAsync<Transactions>(`SELECT *
                                                           FROM Transactions
                                                           ORDER BY Date DESC;`);
        setTransactions(result);

        const categoriesResult = await db.getAllAsync<Category>(`SELECT *
                                                                 FROM Categories;`);
        setCategories(categoriesResult);

        const now = new Date();

        //get first day of the month
        const StartOfTheMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        //get last day of the month
        const EndOfTheMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        EndOfTheMonth.setMilliseconds(EndOfTheMonth.getMilliseconds() - 1)

        //convert UNIX timestamps to seconds
        const StartOfTheMonthTImeStamp = Math.floor(StartOfTheMonth.getTime() / 1000)
        const EndOfTheMonthTImeStamp = Math.floor(EndOfTheMonth.getTime() / 1000)

        const transactionsByMonth = await db.getAllAsync<transactionByMonth>(
            `
                SELECT COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS TotalExpense,
                       COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0)  AS TotalIncome,
                FROM Transactions
                WHERE date >= ? AND date <= ?;
            `, [StartOfTheMonthTImeStamp, EndOfTheMonthTImeStamp]
        );
        setTransactionByMonth(transactionsByMonth[0]);
    }

    async function DeleteTransaction(id: number) {
        db.withTransactionSync(async () => {
            await db.runAsync(`DELETE
                               FROM Transactions
                               WHERE id = ?;`, [id]);
            await Query();
        })
    }

    async function InsertTransaction(transaction: Transactions) {
        db.withTransactionSync(async () => {
            await db.runAsync(
                `INSERT INTO Transactions (category_id, date, amount, description, type)
             VALUES (?, ?, ?, ?, ?);`,  // <- Added comma here
                [transaction.category_id,
                    transaction.date,
                    transaction.amount,
                    transaction.description,
                    transaction.type,
                ]
            );
            await Query();
        });
    }

    return (
        <ScrollView contentContainerStyle={{padding: 15, paddingVertical: 170}}>
            <AddTransaction insertTransaction={InsertTransaction}/>
            <TotalIncomeByMonth totalIncome={TransactionByMonth.totalIncome}
                                totalExpenses={TransactionByMonth.totalExpenses}/>
            <TransactionsList
                transactions={Transactions}
                categories={Categories}
                deleteTransaction={DeleteTransaction}
            />
        </ScrollView>

    )
}

function TotalIncomeByMonth({totalExpenses, totalIncome}: transactionByMonth) {
    const savings = totalIncome - totalExpenses;
    const ReadablePeriod = new Date().toLocaleDateString("default", {month: "long", year: "numeric"});

    const getMoneyTextStyle = (value: number): TextStyle => ({
        fontWeight: "bold",
        color: value < 0 ? "red" : "green",
    })

    const formatMoney = (value: number) => {
        const absValue = Math.abs(value).toFixed(2);
        return `${value < 0 ? "-" : ""}$${absValue}`
    }

    return (
        <UICard>
            <Text style={styles.periodTitle}> Summary for {ReadablePeriod}</Text>
            <Text style={styles.summaryText}>
                Income: {""}
                <Text style={getMoneyTextStyle(totalIncome)}>
                    {formatMoney(totalIncome)}
                </Text>
            </Text>
            <Text style={styles.summaryText}>
                Expense: {""}
                <Text style={getMoneyTextStyle(totalExpenses)}>
                    {formatMoney(totalExpenses)}
                </Text>
            </Text>
            <Text style={styles.summaryText}>
                Savings: {""}
                <Text style={getMoneyTextStyle(savings)}>{formatMoney(savings)}</Text>
            </Text>
        </UICard>
    )
}

const styles = StyleSheet.create({
    periodTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 15,
    },
    summaryText: {
        fontSize: 18,
        color: "#333333",
        marginBottom: 10,
    }
})