import React from "react";
import { Redirect } from "expo-router";

const IndexScreen = (): React.JSX.Element => {
	return <Redirect href="/splash" />;
};

export default IndexScreen;
