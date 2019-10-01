let orders = [
    {
        $: {
            Code: '2040',
            Name: '',
            Price: '4.22',
            Qty: '4',
            QtyPromo: '0',
            TotalPrice: '16.76',
            currentSelected: false,
            extras: [],
            subProducts: []
        }
    }
]

export const order1 = {
    data: {
        attributes: {
            classification: 'cod',
            labels: ['cod-lane-1'],
            payload: {
                data: {
                    eCOCsaleInfo: {
                        Header: [],
                        Order: []
                    }
                },
                type: 'order_overview'
            }
        }
    }
}

export const orderComplete = {
    data: {
        attributes: {
            classification: 'cod',
            labels: ['cod-lane-1'],
            payload: {
                data: {
                    eCOCsaleInfo: {
                        Header: [
                            {
                                $: {
                                    OrderState: '5'
                                }
                            }
                        ],
                        Order: [
                            {
                                $:{

                                },
                                Item: [
                                    {
                                        $: {
                                            Cod: '12',
                                            QtyVoided: 0,
                                            Qty: 1,
                                        }
                                    }
                                ]

                            }
                        ]
                    }
                },
                type: 'order_view'
            }
        }
    }
}

export const orderUpdate = {
    data: {
        attributes: {
            classification: 'cod',
            labels: ['cod-lane-1'],
            payload: {
                data: {
                    eCOCsaleInfo: {
                        Header: [
                            {
                                $: {
                                    OrderState: '1'
                                }
                            }
                        ],
                        Order: [
                            {
                                $:{

                                },
                                Item: [
                                    {
                                        $: {
                                            Cod: '12',
                                            QtyVoided: 0,
                                            Qty: 1,
                                        }
                                    }
                                ]

                            }
                        ]
                    }
                },
                type: 'order_view'
            }
        }
    }
}

export class Fake {
    constructor(view){
        this.view = view
    }

    getData(){
        return {
            data: {
                attributes: {
                    classification: 'cod',
                    labels: ['cod-lane-1'],
                    payload: {
                        data: {
                            eCOCsaleInfo: {
                                Header: [{
                                    $: {
                                        OrderState: this.view.toString()
                                    }
                                }],
                                Order: [{
                                    $:{},
                                    Item: [
                                        {
                                            $: {
                                                Cod: '12',
                                                QtyVoided: 0,
                                                Qty: 1,
                                            }
                                        }
                                    ]
                                }]
                            }
                        },
                        type: 'order_view'
                    }
                }
            }
        }
    }
}
