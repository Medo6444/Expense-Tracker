import {Transactions, Category} from "../types";
import {Text, TouchableOpacity, View} from "react-native";
import TransactionsListItem from "./TransactionsListItem";

export default function TransactionsList({
                                             transactions,
                                             categories,
                                             deleteTransaction,
                                         }: {
    categories: Category[];
    transactions: Transactions[];
    deleteTransaction: (id: number) => Promise<void>;
}) {
    return (
        <View>
            {
                transactions.map((transaction) => {

                    const categoryOfCurrentSelection = categories.find(
                        (category) => category.id === transaction.category_id
                    );
                    return (
                        <TouchableOpacity key={transaction.id} activeOpacity={0.7} onLongPress={() => {
                            deleteTransaction(transaction.id)
                        }}>
                            <TransactionsListItem
                                transaction={transaction}
                                categoryInfo={categoryOfCurrentSelection}
                            />
                        </TouchableOpacity>
                    );
                })
            }
        </View>
    );
}