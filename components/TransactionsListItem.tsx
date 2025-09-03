import {Category, Transactions} from "../types";
import {AntDesign} from "@expo/vector-icons";
import {AutoSizeText, ResizeTextMode} from "react-native-auto-size-text";
import {Text, View, StyleSheet} from "react-native";
import {Card} from "./UI/card";
import {CategoryColors} from "../constant";

interface TransactionsListItemProps {
    transaction: Transactions;
    categoryInfo: Category | undefined;
}

export default function TransactionsListItem({transaction, categoryInfo}: TransactionsListItemProps) {
    const iconName = transaction.type === "EXPENSE" ? "minuscircle" : "pluscircle";
    const color = transaction.type === "EXPENSE" ? "red" : "green";
    const categoryColor = CategoryColors[categoryInfo?.name ?? "Default"];
    return (
        <Card>
            <View style={styles.row}>
                <View style={{width: "40%", gap: 3}}>
                    <Amount amount={transaction.amount} color={color} iconName={iconName}/>
                </View>
                <TransactionInfo description={transaction.description} id={transaction.id} date={transaction.date}/>
            </View>
        </Card>
    )
}

function Amount({color, iconName, amount}: { amount: number; color: string; iconName: "pluscircle" | "minuscircle" }) {
    return (
        <View>
            <AntDesign size={18} color={color} name={iconName}/>
            <AutoSizeText
                fontSize={32}
                mode={ResizeTextMode.max_lines}
                numberOfLines={1}
                style={[styles.amount, {maxWidth: "80%"}]}
            >
                ${amount}
            </AutoSizeText>
        </View>
    )
}

function TransactionInfo({description, date, id}: { description: string, id: number, date: number }) {
    return (
        <View style={{flexGrow: 1, gap: 6, flexShrink: 1}}>
            <Text style={{fontSize: 16, fontWeight: "bold"}}>{description}</Text>
            <Text>Transaction number {id}</Text>
            <Text style={{fontSize: 12, color: "purple"}}>{new Date(date * 1000).toDateString()}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    amount: {
        fontSize: 32,
        fontWeight: 800,
    },
    row: {
        flexDirection: "row",
        alignContent: "center",
        gap: 6
    },
    categoryContainer: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 3,
        alignSelf: "flex-start",
    },
    categoryText: {
        fontSize: 32,
    }
})