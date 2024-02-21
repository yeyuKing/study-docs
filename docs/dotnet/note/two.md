#### 在C# web api 返回 `Dictionary<string, object> ` 无法反序列化，使用 `IActionResult`进行返回，如下：
::: details 点击查看代码
``` csharp
public async Task<IActionResult> SearchProductV2(FySearchProductV2Request param){
     var data= await _service.SearchProductV2(param); 
    return Content(Newtonsoft.Json.JsonConvert.SerializeObject(data), "application/json");
}
```
::: 