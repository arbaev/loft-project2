<?php

	$search = $_POST['search'];
	$data = array();


	if ($search === '') {
		$data['status'] = 'empty';
		$data['text'] = 'Пустой поисковый запрос';
	}else{
		$data['status'] = 'OK';
		$data['text'] = $search;
	}

	header("Content-Type: application/json");
	echo json_encode($data);
	exit;

?>