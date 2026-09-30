//
//  SceneDelegate.swift
//  project01_mobile
//
//  Created by Kostas Vitiniotis on 30/9/26.
//


import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else {
            return
        }

        let window = UIWindow(windowScene: windowScene)
        self.window = window

        guard
            let appDelegate = UIApplication.shared.delegate as? AppDelegate,
            let factory = appDelegate.reactNativeFactory
        else {
            return
        }

        factory.startReactNative(
            withModuleName: "project01_mobile",
            in: window,
            launchOptions: nil
        )
    }
}