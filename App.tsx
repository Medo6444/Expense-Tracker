import {SQLiteProvider} from 'expo-sqlite';
import {ActivityIndicator, Text, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';
import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import Home from "./screens/home";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const loadDataBase = async () => {
    const DBName = "expenseTrackerDB.db";
    const DBAsset = require("./assets/expenseTrackerDB.db");
    const DBURI = Asset.fromModule(DBAsset).uri;
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${DBName}`;

    const FileInfo = await FileSystem.getInfoAsync(dbFilePath);
    if (!FileInfo.exists) {
        await FileSystem.makeDirectoryAsync(
            `${FileSystem.documentDirectory}SQLite`, {intermediates: true}
        );
        await FileSystem.downloadAsync(DBURI, dbFilePath);
    }
}

export default function App() {
    const [DBLoaded, setDBLoaded] = React.useState <boolean>(false);

    React.useEffect(() => {
        loadDataBase().then(() => setDBLoaded(true)).catch((e) => console.error(e));
    }, [])

    if (!DBLoaded) {
        return (<View style={{flex: 1, alignItems: "center", alignContent: "center", justifyContent: "center"}}>
            <ActivityIndicator size={"large"}/>
            <Text>data base has failed to load</Text>
        </View>
        );
    }

    return (
        <React.Suspense
        fallback={<View style={{flex: 1, alignItems: "center", alignContent: "center", justifyContent: "center"}}>
            <ActivityIndicator size={"large"}/>
            <Text>data base has failed to load</Text>
        </View>}
        >
            <NavigationContainer>
            <SQLiteProvider
            databaseName = "expenseTrackerDB.db" useSuspense={true}>
                <Stack.Navigator>
                    <Stack.Screen name={"home"} component={Home}
                      options= {{
                        headerTitle: "Expense Tracker",
                        headerLargeTitle: true
                    }}/>
                </Stack.Navigator>
            </SQLiteProvider>
            </NavigationContainer>
        </React.Suspense>
    );
}