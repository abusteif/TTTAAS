//
// export const testCases = {
//
//   TTV2:{
//     test_suite1:["test_case1", "test_case2", "test_case3","test_case4"],
//     //test_suite2:["test_case5","test_case6", "test_case7"],
//     test_suite3:["test_case8", "test_case9"],
//     //test_suite4:["test_case10","test_case11", "test_case12","test_case13"]
//   },
//   TTV3:{
//     //test_suite5:["test_case14", "test_case15", "test_case16","test_case17"],
//     test_suite6:["test_case18","test_case19", "test_case20"],
//     test_suite7:["test_case21", "test_case22"],
//     test_suite8:["test_case23","test_case24", "test_case25","test_case26"]
//   }
// }
//
//

export const testApps = [
  {
    name: "TTV2",
    id: "3d525bca-d8a6-4fec-a8f2-26ff3d08daaf",
    parentId: null
  },
  {
    name: "TTV3",
    id: "10f33cf9-a155-47ae-bfa9-a0e40a2f9f10",
    parentId: null
  }
];

export const testSuites = [
  {
    name: "test_suite1",
    id: "5a930ac2-31de-4b54-a96c-b62150e00b18",
    parentId: "3d525bca-d8a6-4fec-a8f2-26ff3d08daaf"
  },
  {
    name: "test_suite2",
    id: "88ff28ef-4bef-4040-8ca6-90f26365a2f6",
    parentId: "3d525bca-d8a6-4fec-a8f2-26ff3d08daaf"
  },
  {
    name: "test_suite3",
    id: "b1b072ae-8dc2-4f96-9fcf-fe5854f51b20",
    parentId: "3d525bca-d8a6-4fec-a8f2-26ff3d08daaf"
  },
  {
    name: "test_suite4",
    id: "e1c10c1a-0ffe-4233-bd2e-257961392d6d",
    parentId: "3d525bca-d8a6-4fec-a8f2-26ff3d08daaf"
  },
  //-----------------------------------------------------------
  {
    name: "test_suite5",
    id: "bc40ce2a-d82e-47ce-a440-468cf81c4aec",
    parentId: "10f33cf9-a155-47ae-bfa9-a0e40a2f9f10"
  },
  {
    name: "test_suite6",
    id: "02e52f76-5186-4b24-8d75-fd294ff1029c",
    parentId: "10f33cf9-a155-47ae-bfa9-a0e40a2f9f10"
  },
  {
    name: "test_suite7",
    id: "1fa3855f-d87a-4d2a-8118-52f46cf1da5b",
    parentId: "10f33cf9-a155-47ae-bfa9-a0e40a2f9f10"
  },
  {
    name: "test_suite8",
    id: "e330d176-e802-4bc8-ab71-02ee1722179f",
    parentId: "10f33cf9-a155-47ae-bfa9-a0e40a2f9f10"
  }
];

export const testCases = [
  {
    name: "test_case1",
    id: "f7b97c47-a400-4402-b5b0-4ca15d0fb12b",
    parentId: "5a930ac2-31de-4b54-a96c-b62150e00b18",
    steps: [
      {
        order: 1,
        action: "up",
        delay: 1,
        expectedBehaviour: "pci.jpg",
        type: "type1"
      },
      {
        order: 2,
        action: "down",
        delay: 2,
        expectedBehaviour: null,
        type: null
      },
      {
        order: 3,
        action: "back",
        delay: 3,
        expectedBehaviour: "bubble-test.jpg",
        type: null
      },
      {
        order: 4,
        action: "home",
        delay: 4,
        expectedBehaviour: "telstra-tv-3.jpg",
        type: "result"
      },
      {
        order: 5,
        action: "left",
        delay: 5,
        expectedBehaviour: "telstra-tv-3.jpg",
        type: null
      },
      {
        order: 6,
        action: "right",
        delay: 3,
        expectedBehaviour: null,
        type: null
      },
      {
        order: 7,
        action: "star",
        delay: 3,
        expectedBehaviour: "pci.jpg",
        type: null
      },
      {
        order: 8,
        action: "undo",
        delay: 3,
        expectedBehaviour: "pci.jpg",
        type: null
      }
    ]
  },
  {
    name: "test_case2",
    id: "fffd2c74-d450-4de2-9a09-e951099fd259",
    parentId: "5a930ac2-31de-4b54-a96c-b62150e00b18"
  },
  {
    name: "test_case3",
    id: "199c1f78-ca7c-43bd-b8d4-6eb6be8bb2d5",
    parentId: "5a930ac2-31de-4b54-a96c-b62150e00b18"
  },
  {
    name: "test_case4",
    id: "34e072e7-2889-4206-982a-2ccd5863fc82",
    parentId: "5a930ac2-31de-4b54-a96c-b62150e00b18"
  },
  //---------------------------------------------------------
  {
    name: "test_case5",
    id: "ac9ddaa4-b486-4758-a318-08416f4bfb6e",
    parentId: "88ff28ef-4bef-4040-8ca6-90f26365a2f6"
  },
  {
    name: "test_case6",
    id: "6f65e647-35e7-4367-a9c7-65499c8bc93e",
    parentId: "88ff28ef-4bef-4040-8ca6-90f26365a2f6"
  },
  {
    name: "test_case7",
    id: "28c0be23-ed6a-4976-bf65-2ba914cb689a",
    parentId: "88ff28ef-4bef-4040-8ca6-90f26365a2f6"
  },
  //----------------------------------------------------------------
  {
    name: "test_case8",
    id: "393c16e6-640a-4131-857d-0cc3cd55272a",
    parentId: "b1b072ae-8dc2-4f96-9fcf-fe5854f51b20"
  },
  {
    name: "test_case9",
    id: "54330120-e229-4ec6-8a19-147506f3f11d",
    parentId: "b1b072ae-8dc2-4f96-9fcf-fe5854f51b20"
  },
  //----------------------------------------------------------------------
  {
    name: "test_case10",
    id: "632066ca-725e-4ddb-884e-ed0d6ffbcd74",
    parentId: "e1c10c1a-0ffe-4233-bd2e-257961392d6d"
  },
  {
    name: "test_case11",
    id: "e27560b0-a057-40bd-9bf9-ff5576cbc14c",
    parentId: "e1c10c1a-0ffe-4233-bd2e-257961392d6d"
  },
  {
    name: "test_case12",
    id: "f2e46d5a-0a4f-4804-bc6e-60466c1f4721",
    parentId: "e1c10c1a-0ffe-4233-bd2e-257961392d6d"
  },
  {
    name: "test_case13",
    id: "f2002548-9033-45b4-a343-81c800348ea7",
    parentId: "e1c10c1a-0ffe-4233-bd2e-257961392d6d"
  },
  //---------------------------------------------------------------------------
  {
    name: "test_case14",
    id: "ec8b2dbb-3da7-453d-b57f-043fc72db4ba",
    parentId: "bc40ce2a-d82e-47ce-a440-468cf81c4aec"
  },
  {
    name: "test_case15",
    id: "a484df82-0194-443c-bd0b-9321bde12498",
    parentId: "bc40ce2a-d82e-47ce-a440-468cf81c4aec"
  },
  {
    name: "test_case16",
    id: "3548da79-1cdf-4988-9112-965731d87267",
    parentId: "bc40ce2a-d82e-47ce-a440-468cf81c4aec"
  },
  {
    name: "test_case17",
    id: "bf7a6ef1-c846-4290-bc51-0b955a572e35",
    parentId: "bc40ce2a-d82e-47ce-a440-468cf81c4aec"
  },
  //----------------------------------------------------------------------
  {
    name: "test_case18",
    id: "b022b90c-d795-478b-9981-d09a5d59cd49",
    parentId: "02e52f76-5186-4b24-8d75-fd294ff1029c"
  },
  {
    name: "test_case19",
    id: "5d7db34b-7f6f-4b43-b112-331592380765",
    parentId: "02e52f76-5186-4b24-8d75-fd294ff1029c"
  },
  {
    name: "test_case20",
    id: "dff4d4a6-fd21-44ca-9e6d-efcd3bcb9ffb",
    parentId: "02e52f76-5186-4b24-8d75-fd294ff1029c"
  },
  //-----------------------------------------------------------
  {
    name: "test_case21",
    id: "f41c5267-af3d-43c9-a47f-4edf40538a8c",
    parentId: "1fa3855f-d87a-4d2a-8118-52f46cf1da5b"
  },
  {
    name: "test_case22",
    id: "26932a66-1c16-4202-a341-fe5a2cdd8744",
    parentId: "1fa3855f-d87a-4d2a-8118-52f46cf1da5b"
  },
  //-------------------------------------------------------------
  {
    name: "test_case23",
    id: "704d8a3d-caa2-44e3-86e9-350199a89835",
    parentId: "e330d176-e802-4bc8-ab71-02ee1722179f"
  },
  {
    name: "test_case24",
    id: "2b9c2b30-d628-4a51-afa5-a8e157cf0125",
    parentId: "e330d176-e802-4bc8-ab71-02ee1722179f"
  },
  {
    name: "test_case25",
    id: "ceef79de-1e50-49a2-a4d6-e35202b90309",
    parentId: "e330d176-e802-4bc8-ab71-02ee1722179f"
  },
  {
    name: "test_case26",
    id: "418292f9-4617-4635-a674-94fecb517d11",
    parentId: "e330d176-e802-4bc8-ab71-02ee1722179f"
  }
];
